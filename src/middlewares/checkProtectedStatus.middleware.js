// middlewares/checkProtectedStatus.middleware.js
const ProtectedCitizen = require("../models/protectedCitizen.model");

const checkProtectedStatus = async (req, res, next) => {
    try {
        const userRole = req.user?.role;

        // Si es Super Admin (Rol 5), inmunidad total de lectura
        if (userRole === 5) {
            req.isSuperAdmin = true;
            req.protectedMap = new Set(); 
            return next();
        }

        req.isSuperAdmin = false;

        // IMPORTANTE: Filtrar solo los registros que están ACTIVAMENTE protegidos
        const protectedList = await ProtectedCitizen.findAll({
            where: { protected: true },
            attributes: ["citizenID"],
            raw: true
        });

        // Cargamos en el Set para búsquedas O(1) ultrarrápidas
        req.protectedMap = new Set(protectedList.map(p => p.citizenID));
        
        next();
    } catch (error) {
        console.error("Error en checkProtectedStatus middleware:", error);
        // Por seguridad, si el sistema falla, bloqueamos preventivamente
        req.isSuperAdmin = false;
        req.protectedMap = new Set();
        next();
    }
};