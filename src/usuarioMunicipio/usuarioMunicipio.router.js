// routes/usuarioMunicipio.router.js
const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
    adminValidate,
    leaderValidate,
} = require("../middlewares/role.middleware");
const usuarioMunicipioController = require("./usuarioMunicipio.controller");

require("../middlewares/auth.middleware")(passport);

// Asignar municipios a un usuario (sin eliminar los anteriores)
router.post(
    "/asignar",
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    usuarioMunicipioController.asignarMunicipiosAUsuarioService
);

//  Sincronizar municipios (reemplaza completamente la lista)
router.post(
    "/sincronizar",
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    usuarioMunicipioController.sincronizarMunicipiosDeUsuarioService
);

// Obtener lista de usuarios con sus municipios asignados
router.get(
    "/usuarios",
    passport.authenticate("jwt", { session: false }),
    leaderValidate,
    usuarioMunicipioController.getUsuariosConMunicipiosService
);

// Obtener lista de municipios por id de usuario
router.get(
    "/municipios/:idusuario",
    passport.authenticate("jwt", { session: false }),
    leaderValidate,
    usuarioMunicipioController.getMunicipiosPorUsuarioService
);

// Obtener todos los municipios
router.get(
    "/municipios",
    passport.authenticate("jwt", { session: false }),
    usuarioMunicipioController.getTodosLosMunicipiosService
);

module.exports = router;
