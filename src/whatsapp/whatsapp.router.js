const {
    sendMessage,
    getSessionStatus,
    getAdminSessionStatus,
    restartSession,
    logoutSession,
} = require("./whatsapp.controller");
const router = require("express").Router();
const passport = require("passport");
const { adminValidate } = require("../middlewares/role.middleware");

require("../middlewares/auth.middleware")(passport);

// Inicializa WhatsApp Client
require("./whatsappClient");

// Define la ruta para enviar mensajes
router.route("/send-message").post(sendMessage);
router.route("/session-status").get(getSessionStatus);
router.route("/admin/session-status").get(
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    getAdminSessionStatus
);
router.route("/admin/session-restart").post(
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    restartSession
);
router.route("/admin/session-logout").post(
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    logoutSession
);

module.exports = router;
