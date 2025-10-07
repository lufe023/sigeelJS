const { Sequelize } = require("sequelize");
const config = require("../config");

const db = new Sequelize({
    dialect: "postgres",
    host: config.db.host, //? Variable de entorno del host
    username: config.db.username, //? Variable de entorno del usuario
    password: config.db.password, //? Variable de entorno de la contraseña
    database: config.db.dbName, //? Variable de entorno de la base de datos
    dialectOptions:
        process.env.NODE_ENV === "production"
            ? {
                  ssl: {
                      require: true,
                      rejectUnauthorized: false,
                  },
              }
            : {},
});

const dbFotos = new Sequelize({
    dialect: "mssql", // ⚠️ Usa el dialecto correcto, por ejemplo 'mssql' si es SQL Server
    host: process.env.DBFOTOS_HOST,
    username: process.env.DBFOTOS_USER,
    password: process.env.DBFOTOS_PASS,
    database: process.env.DBFOTOS_NAME, // dbBIS
    port: process.env.DBFOTOS_PORT || 1433,
    dialectOptions: {
        options: {
            encrypt: false, // o true si tu servidor lo requiere
            trustServerCertificate: true, // útil para entornos locales
        },
    },
});

module.exports = db;
module.exports.dbFotos = dbFotos;
