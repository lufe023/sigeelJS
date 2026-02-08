const router = require("express").Router();
const passport = require("passport");
const usuarioSectorController = require("./usuarioSectorParaje.controller.js");
const {
    adminValidate,
    itSupportValidate,
    superAdminValidate,
} = require("../middlewares/role.middleware");

// 1. Obtener sectores para asignación (Requiere estar logueado)
// Esta ruta la usa el Dual Listbox para cargar la data
router.get(
    "/usuarios/:id/sectores-asignacion",
    passport.authenticate("jwt", { session: false }),
    usuarioSectorController.getSectoresParaAsignacion,
);

// 2. Sincronizar sectores (Solo Administradores o IT Support)
router.post(
    "/usuarios/sectores/sincronizar",
    passport.authenticate("jwt", { session: false }),
    adminValidate, // Solo admins pueden repartir el territorio
    usuarioSectorController.postSincronizarSectores,
);

module.exports = router;
