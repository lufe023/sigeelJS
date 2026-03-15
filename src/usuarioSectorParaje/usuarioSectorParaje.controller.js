const usuarioSectorService = require("./usuarioSectorParaje.services.js");

/**
 * Obtiene la data necesaria para inicializar el Dual Listbox:
 * Todos los sectores disponibles vs los ya asignados al usuario.
 */
const getSectoresParaAsignacion = async (req, res) => {
    try {
        const { id } = req.params; // ID del Usuario

        const [todos, asignados] = await Promise.all([
            usuarioSectorService.obtenerTodosLosSectoresConJerarquia(),
            usuarioSectorService.obtenerSectoresPorUsuario(id),
        ]);

        res.status(200).json({
            status: "success",
            data: {
                todos,
                asignados,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener los sectores para asignación",
            error: error.message,
        });
    }
};

/**
 * Sincroniza (agrega/elimina) los sectores de un usuario
 */
const postSincronizarSectores = async (req, res) => {
    try {
        const { idUsuario, nuevosSectores } = req.body;

        if (!idUsuario) {
            return res
                .status(400)
                .json({ message: "El idUsuario es requerido" });
        }

        // nuevosSectores debe ser un array de IDs [1, 2, 3...]
        const resultado =
            await usuarioSectorService.sincronizarSectoresDeUsuario(
                idUsuario,
                nuevosSectores || [],
            );

        res.status(200).json({
            status: "success",
            message: "Sectores sincronizados correctamente",
            data: resultado,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al sincronizar los sectores del usuario",
            error: error.message,
        });
    }
};

module.exports = {
    getSectoresParaAsignacion,
    postSincronizarSectores,
};
