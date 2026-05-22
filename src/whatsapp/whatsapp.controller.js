const client = require('./whatsappClient');
const { getWhatsAppState } = require('../socket/io');

let isSessionActionInProgress = false;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tryGetClientState = async () => {
    if (typeof client.getState !== "function") return null;

    try {
        return await client.getState();
    } catch (error) {
        return null;
    }
};

const buildSessionStatusPayload = async () => {
    const socketState = getWhatsAppState();
    const rawClientState = await tryGetClientState();
    const resolvedClientState = socketState.clientState || rawClientState || null;

    return {
        ...socketState,
        clientState: resolvedClientState,
        rawClientState,
        actionInProgress: isSessionActionInProgress,
    };
};

const sendMessage = async (req, res) => {
    const { number, message } = req.body;

    try {
        const chatId = `${number}@c.us`;
        await client.sendMessage(chatId, message);
        res.send({ status: 'Enviado', number, message });
    } catch (error) {
        res.status(500).send({ status: 'Error', message: error.message });
    }
};

const getSessionStatus = (req, res) => {
    return res.status(200).json(getWhatsAppState());
};

const getAdminSessionStatus = async (req, res) => {
    try {
        const payload = await buildSessionStatusPayload();
        return res.status(200).json(payload);
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "No se pudo consultar el estado de WhatsApp",
            detail: error.message,
        });
    }
};

const restartSession = async (req, res) => {
    if (isSessionActionInProgress) {
        return res.status(409).json({
            status: "Busy",
            message: "Ya hay una accion de sesion en progreso",
        });
    }

    isSessionActionInProgress = true;

    try {
        try {
            await client.destroy();
        } catch (error) {
            // Puede fallar si el cliente no estaba inicializado; continuamos.
        }

        await wait(1200);
        client.initialize().catch((error) => {
            console.error("Error al reiniciar initialize() de WhatsApp:", error);
        });

        return res.status(200).json({
            status: "OK",
            message: "Reinicio solicitado. Espera unos segundos para recibir estado/QR.",
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "No se pudo reiniciar la sesion de WhatsApp",
            detail: error.message,
        });
    } finally {
        isSessionActionInProgress = false;
    }
};

const logoutSession = async (req, res) => {
    if (isSessionActionInProgress) {
        return res.status(409).json({
            status: "Busy",
            message: "Ya hay una accion de sesion en progreso",
        });
    }

    isSessionActionInProgress = true;

    try {
        if (typeof client.logout === "function") {
            try {
                await client.logout();
            } catch (error) {
                // Algunos estados pueden lanzar error al hacer logout; continuamos con destroy+initialize.
            }
        }

        try {
            await client.destroy();
        } catch (error) {
            // Ignorado: estado no inicializado.
        }

        await wait(1200);
        client.initialize().catch((error) => {
            console.error("Error al relanzar initialize() tras logout:", error);
        });

        return res.status(200).json({
            status: "OK",
            message: "Logout solicitado. Debe generarse un nuevo codigo QR.",
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "No se pudo cerrar la sesion de WhatsApp",
            detail: error.message,
        });
    } finally {
        isSessionActionInProgress = false;
    }
};

module.exports = {
    sendMessage,
    getSessionStatus,
    getAdminSessionStatus,
    restartSession,
    logoutSession,
};
