const { Server } = require("socket.io");

let io = null;

const whatsappState = {
    status: "initializing",
    clientState: null,
    qrImageUrl: null,
    updatedAt: new Date().toISOString(),
    message: "Inicializando cliente de WhatsApp",
};

const isAllowedOrigin = (origin, allowedOrigins) => {
    if (!origin) return true;
    return allowedOrigins.includes(origin);
};

const initSocket = (server, allowedOrigins = []) => {
    if (io) return io;

    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (isAllowedOrigin(origin, allowedOrigins)) {
                    return callback(null, true);
                }

                return callback(new Error("Origen no permitido por Socket.IO"));
            },
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.emit("whatsapp:status", whatsappState);

        if (whatsappState.qrImageUrl) {
            socket.emit("whatsapp:qr", {
                qrImageUrl: whatsappState.qrImageUrl,
                updatedAt: whatsappState.updatedAt,
            });
        }
    });

    return io;
};

const getIO = () => io;
const getWhatsAppState = () => ({ ...whatsappState });

const updateWhatsAppStatus = ({
    status,
    message,
    qrImageUrl = whatsappState.qrImageUrl,
    clientState = whatsappState.clientState,
}) => {
    whatsappState.status = status;
    whatsappState.message = message || whatsappState.message;
    whatsappState.qrImageUrl = qrImageUrl;
    whatsappState.clientState = clientState;
    whatsappState.updatedAt = new Date().toISOString();

    if (!io) return;

    io.emit("whatsapp:status", whatsappState);
};

const emitWhatsAppQr = (qrImageUrl) => {
    whatsappState.qrImageUrl = qrImageUrl;
    whatsappState.clientState = "UNPAIRED";
    whatsappState.updatedAt = new Date().toISOString();

    if (!io) return;

    io.emit("whatsapp:qr", {
        qrImageUrl,
        updatedAt: whatsappState.updatedAt,
    });

    io.emit("whatsapp:status", whatsappState);
};

module.exports = {
    initSocket,
    getIO,
    getWhatsAppState,
    updateWhatsAppStatus,
    emitWhatsAppQr,
};
