const usuarioMunicipioController = require("./usuarioMunicipio.services");

//? ################################################# UsuarioMunicipio area ###################################################

// Crear o asignar municipios a un usuario (sin eliminar los anteriores)
const asignarMunicipiosAUsuarioService = (req, res) => {
    const { idusuario, idmunicipios } = req.body;

    if (!idusuario || !Array.isArray(idmunicipios)) {
        return res.status(400).json({
            message: "Debe enviar idusuario y un array de idmunicipios",
        });
    }

    usuarioMunicipioController
        .asignarMunicipiosAUsuario(idusuario, idmunicipios)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json({ message: err.message }));
};

// Sincronizar municipios de un usuario (actualiza completamente su lista)
const sincronizarMunicipiosDeUsuarioService = (req, res) => {
    const { idusuario, idmunicipios } = req.body;

    if (!idusuario || !Array.isArray(idmunicipios)) {
        return res.status(400).json({
            message: "Debe enviar idusuario y un array de idmunicipios",
        });
    }

    usuarioMunicipioController
        .sincronizarMunicipiosDeUsuario(idusuario, idmunicipios)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json({ message: err.message }));
};

// Obtener todos los usuarios con sus municipios asignados
const getUsuariosConMunicipiosService = (req, res) => {
    usuarioMunicipioController
        .obtenerUsuariosConMunicipios()
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json({ message: err.message }));
};

// Obtener municipios por ID de usuario
const getMunicipiosPorUsuarioService = (req, res) => {
    const { idusuario } = req.params;

    if (!idusuario) {
        return res.status(400).json({
            message: "Debe enviar el parámetro idusuario en la URL",
        });
    }

    usuarioMunicipioController
        .obtenerMunicipiosPorUsuario(idusuario)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json({ message: err.message }));
};

const getTodosLosMunicipiosService = (req, res) => {
    usuarioMunicipioController
        .obtenerTodosLosMunicipios()
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json({ message: err.message }));
};

module.exports = {
    asignarMunicipiosAUsuarioService,
    sincronizarMunicipiosDeUsuarioService,
    getUsuariosConMunicipiosService,
    getMunicipiosPorUsuarioService,
    getTodosLosMunicipiosService,
};
