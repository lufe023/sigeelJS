const { sendMessage } = require("./whatsapp.controller");
const router = require("express").Router();
const passport = require("passport");

require("../middlewares/auth.middleware")(passport);

// Inicializa WhatsApp Client
require("./whatsappClient");

// Define la ruta para enviar mensajes
router.route("/send-message").post(sendMessage);

module.exports = router;
