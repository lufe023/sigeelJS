const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const { port } = require("./config");
const db = require("./utils/database");
const initModels = require("./models/initModels");
const bodyParser = require("body-parser");
require("dotenv").config();
const shouldAlter = process.env.DB_SYNC_ALTER === 'true';
//* Routes
const userRouter = require("./users/users.router");
const authRouter = require("./auth/auth.router");
const censusRouter = require("./census/census.router");
const todoRouter = require("./todo/todo.router");
const ballotsRouter = require("./ballots/ballots.router");
const mapsRouter = require("./maps/maps.router");
const pollsRouter = require("./polls/polls.router");
const imageRouter = require("./images/images.router");
const dashboard = require("./dashboard/dashboard.router");
const teamsRouter = require("./teams/teams.router");
const inTouchRouter = require("./inTouch/inTouch.router");
const ties = require("./ties/ties.router");
const gpsRouter = require("./gps/gps.router");
const jceRouter = require("./jce/jce.router");
const campain = require("./campain/campain.router");
const reports = require("./reports/reports.router");
const suffrage = require("./suffrage/suffrage.router");
const whatsapp = require("./whatsapp/whatsapp.router");
const UsuarioMunicipio = require("./usuarioMunicipio/usuarioMunicipio.router");
const UsuarioSectorParaje = require("./usuarioSectorParaje/usuarioSectorParaje.router");
//? Initial Configurations
const app = express();

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));

const allowedOrigins = [
    "https://luisalcalde.mielector.com",
    "https://sigeeljs-production.up.railway.app",
    "https://sigeelfront.pages.dev",
    "http://localhost:5173",
    "https://localhost:5173",
    "http://localhost:4173",
    "https://localhost:4173",
    "http://192.168.100.13:5173",
    "http://192.168.100.13:4173",
    "http://192.168.100.13:9000",
    "https://192.168.100.13:9000"
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir si no hay origen (Postman/Apps) o si está en la lista
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error("🚫 ORIGEN BLOQUEADO POR SIGEEL:", origin);
            callback(new Error("No permitido por la política de seguridad Sigeel"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

initModels();

db.authenticate()
    .then(() => {
        console.log("Database Authenticated");
        // Solo sincronizamos DESPUÉS de haber autenticado e inicializado modelos
        return db.sync({ alter: false }); 
    })
    .then(() => {
        console.log("Database Synced");
    })
    .catch((err) => {
        console.log("Error en la base de datos:", err);
    });

app.get("/", (req, res) => {
    res.status(200).json({
        message: "OK!",
        users: `localhost:${port}/api/v1/users`,
    });
});

//path of routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/census", censusRouter);
app.use("/api/v1/todo", todoRouter);
app.use("/api/v1/ballots", ballotsRouter);
app.use("/api/v1/maps", mapsRouter);
app.use("/api/v1/polls", pollsRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/dashboard", dashboard);
app.use("/api/v1/teams", teamsRouter);
app.use("/api/v1/intouch", inTouchRouter);
app.use("/api/v1/ties", ties);
app.use("/api/v1/gps", gpsRouter);
app.use("/api/v1/jce", jceRouter);
app.use("/api/v1/campains", campain);
app.use("/api/v1/reports", reports);
app.use("/api/v1/suffrages", suffrage);
app.use("/api/v1/whatsapp", whatsapp);
app.use("/api/v1/usuario-municipio", UsuarioMunicipio);
app.use("/api/v1/sector", UsuarioSectorParaje);

// app.listen(port, () => {
//     console.log(`Server started at port ${port}`);
// });
// --- ARRANQUE DEL SERVIDOR CONDICIONADO ---
if (process.env.NODE_ENV === "production") {
    // En Railway (Nube): Usamos http estándar, Railway le pone el SSL
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server started in PRODUCTION at port ${port}`);
    });
} else {
    // En Local: Usamos tus certificados .pem
    try {
        const key = fs.readFileSync("localhost-key.pem");
        const cert = fs.readFileSync("localhost.pem");
        
        https.createServer({ key, cert }, app).listen(port, "0.0.0.0", () => {
            console.log(`🔐 Local Server running at https://localhost:${port}`);
        });
    } catch (error) {
        console.error("❌ Error cargando certificados locales, arrancando en HTTP...");
        app.listen(port, () => console.log(`Server started at port ${port}`));
    }
}