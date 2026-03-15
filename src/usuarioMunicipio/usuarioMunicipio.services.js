const UsuarioMunicipio = require("../models/usuarioMunicipio.model");
const Municipio = require("../models/municipio.models");
const Usuario = require("../models/users.models");

// Sincronizar municipios de un usuario (crear, eliminar, mantener)
const sincronizarMunicipiosDeUsuario = async (
    idUsuario,
    nuevosMunicipios = []
) => {
    try {
        const asignacionesActuales = await UsuarioMunicipio.findAll({
            where: { idusuario: idUsuario },
            attributes: ["idmunicipio"],
        });

        const municipiosActuales = asignacionesActuales.map(
            (a) => a.idmunicipio
        );

        const municipiosAAgregar = nuevosMunicipios.filter(
            (id) => !municipiosActuales.includes(id)
        );
        const municipiosAEliminar = municipiosActuales.filter(
            (id) => !nuevosMunicipios.includes(id)
        );

        if (municipiosAEliminar.length > 0) {
            await UsuarioMunicipio.destroy({
                where: {
                    idusuario: idUsuario,
                    idmunicipio: municipiosAEliminar,
                },
            });
        }

        if (municipiosAAgregar.length > 0) {
            const nuevasAsignaciones = municipiosAAgregar.map(
                (idMunicipio) => ({
                    idusuario: idUsuario,
                    idmunicipio: idMunicipio,
                    estatus: true,
                })
            );
            await UsuarioMunicipio.bulkCreate(nuevasAsignaciones);
        }

        const resultadoFinal = await UsuarioMunicipio.findAll({
            where: { idusuario: idUsuario },
            include: [
                {
                    model: Municipio,
                    attributes: ["MunicipalityId", "MunicipalityName"],
                },
            ],
        });

        return resultadoFinal;
    } catch (error) {
        console.error("Error al sincronizar municipios:", error);
        throw error;
    }
};

// Verificar si un usuario ya tiene un municipio asignado
const existeUsuarioMunicipio = async (idUsuario, idMunicipio) => {
    const asignacion = await UsuarioMunicipio.findOne({
        where: { idusuario: idUsuario, idmunicipio: idMunicipio },
    });
    return !!asignacion;
};

// Asignar municipios nuevos (sin eliminar los antiguos)
const asignarMunicipiosAUsuario = async (idUsuario, idMunicipios = []) => {
    const asignaciones = [];

    for (const idMunicipio of idMunicipios) {
        const existe = await existeUsuarioMunicipio(idUsuario, idMunicipio);
        if (!existe) {
            const nueva = await UsuarioMunicipio.create({
                idusuario: idUsuario,
                idmunicipio: idMunicipio,
                estatus: true,
            });
            asignaciones.push(nueva);
        }
    }

    return asignaciones;
};

// Obtener todos los usuarios con sus municipios asignados
const obtenerUsuariosConMunicipios = async () => {
    const usuarios = await Usuario.findAll({
        include: [
            {
                model: UsuarioMunicipio,
                include: [
                    {
                        model: Municipio,
                        attributes: ["MunicipalityId", "MunicipalityName"],
                    },
                ],
            },
        ],
    });
    return usuarios;
};

// Obtener municipios de un usuario específico
const obtenerMunicipiosPorUsuario = async (idUsuario) => {
    const municipios = await UsuarioMunicipio.findAll({
        where: { idusuario: idUsuario },
        include: [
            {
                model: Municipio,
                as: "municipio", // 🔹 alias correcto según initModels
                attributes: ["MunicipalityId", "description"], // los campos que quieras traer
            },
        ],
    });
    return municipios;
};

const obtenerTodosLosMunicipios = async () => {
    const municipios = await Municipio.findAndCountAll();
    return municipios;
};

module.exports = {
    sincronizarMunicipiosDeUsuario,
    asignarMunicipiosAUsuario,
    existeUsuarioMunicipio,
    obtenerUsuariosConMunicipios,
    obtenerMunicipiosPorUsuario,
    obtenerTodosLosMunicipios,
};
