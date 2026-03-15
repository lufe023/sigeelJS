//usuarioSectorParajeServices.js
const Ciudadseccion = require("../models/ciudadseccion.model");
const Municipality = require("../models/municipio.models");
const Provincia = require("../models/provincia.models");
const SectorParaje = require("../models/sectorParaje.model");
const UsuarioSectorParaje = require("../models/usuarioSectorParaje.models");
// Sincronizar Sectores de un usuario (crear nuevos, eliminar los que ya no están)
const sincronizarSectoresDeUsuario = async (idUsuario, nuevosSectores = []) => {
    try {
        // 1. Obtener lo que el usuario tiene actualmente
        const asignacionesActuales = await UsuarioSectorParaje.findAll({
            where: { idusuario: idUsuario },
            attributes: ["idsectorparaje"],
        });

        const sectoresActualesIds = asignacionesActuales.map(
            (a) => a.idsectorparaje,
        );

        // 2. Determinar qué agregar y qué eliminar
        const sectoresAAgregar = nuevosSectores.filter(
            (id) => !sectoresActualesIds.includes(id),
        );
        const sectoresAEliminar = sectoresActualesIds.filter(
            (id) => !nuevosSectores.includes(id),
        );

        // 3. Ejecutar cambios en la DB
        if (sectoresAEliminar.length > 0) {
            await UsuarioSectorParaje.destroy({
                where: {
                    idusuario: idUsuario,
                    idsectorparaje: sectoresAEliminar,
                },
            });
        }

        if (sectoresAAgregar.length > 0) {
            const nuevasAsignaciones = sectoresAAgregar.map((idSector) => ({
                idusuario: idUsuario,
                idsectorparaje: idSector,
                estatus: true,
            }));
            await UsuarioSectorParaje.bulkCreate(nuevasAsignaciones);
        }

        // 4. Retornar el estado final con toda la jerarquía (para feedback en el front)
        return await obtenerSectoresPorUsuario(idUsuario);
    } catch (error) {
        console.error("Error al sincronizar sectores:", error);
        throw error;
    }
};

// Obtener sectores de un usuario con nombres de Provincia/Municipio
const obtenerSectoresPorUsuario = async (idUsuario) => {
    return await UsuarioSectorParaje.findAll({
        where: { idusuario: idUsuario },
        include: [
            {
                model: SectorParaje,
                as: "sector_paraje",
                include: [
                    {
                        model: Ciudadseccion,
                        as: "ciudadseccion",
                        include: [
                            {
                                model: Municipality,
                                as: "municipio",
                                include: [
                                    { model: Provincia, as: "provincia" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    });
};

const obtenerTodosLosSectoresConJerarquia = async () => {
    const data = await SectorParaje.findAll({
        include: [
            {
                model: Ciudadseccion,
                as: "ciudadseccion",
                include: [
                    {
                        model: Municipality,
                        as: "municipio",
                        include: [{ model: Provincia, as: "provincia" }],
                    },
                ],
            },
        ],
    });

    console.log("Todos los sectores con jerarquía:", data);

    return data;
};

module.exports = {
    sincronizarSectoresDeUsuario,
    obtenerSectoresPorUsuario,
    obtenerTodosLosSectoresConJerarquia,
};
