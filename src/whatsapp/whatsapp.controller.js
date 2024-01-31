const client = require('./whatsappClient');

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

module.exports = {
    sendMessage,
};
