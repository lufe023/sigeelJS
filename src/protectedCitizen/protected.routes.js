// routes/protected.routes.js
const router = require("express").Router();
const passport = require("passport");
const { superAdminValidate } =  require("../middlewares/role.middleware");
const protectedController = require("./protected.controller");

// Endpoint único para activar/desactivar la protección
router.post("/toggle", passport.authenticate("jwt", { session: false }), superAdminValidate, protectedController.toggleProtection);

// Traer la data para armar tu tabla en el Frontend
router.get("/dashboard", passport.authenticate("jwt", { session: false }), superAdminValidate, protectedController.getProtectionDashboard);

module.exports = router;