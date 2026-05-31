const Advice = require("../models/advice.model");
const Users = require("../models/users.models");
const Census = require("../models/census.models");
const { Op } = require("sequelize");

// Obtener todos los anuncios (con filtros opcionales)
const getAllAdviceController = async (query = {}, userRole) => {
const { 
        type, 
        active, 
        showDelegate, 
        showColaborators, 
        showAdministrators,
        dateStart,
        dateEnd,
        displayLocation
} = query;

    // Acceptar "location" como alias para displayLocation
    const locationFilter = displayLocation || query.location;

    const where = {};

    const getRoleFilter = (role) => {
        const roleId = Number(role);

        if ([3, 99].includes(roleId)) {
            return {};
        }

        if (roleId === 2) {
            return { showAdministrators: true };
        }

        if (roleId === 1) {
            return { showColaborators: true };
        }

        if (roleId === 4) {
            return { showDelegate: true };
        }

        return { showAdministrators: false, showColaborators: false, showDelegate: false };
    };

    Object.assign(where, getRoleFilter(userRole));

    if (type) {
        where.type = type;
    }

    const hasDateQuery = dateStart || dateEnd;

    // Por defecto, mostrar solo anuncios activos
    if (active === undefined) {
        where.active = true;
    } else {
        where.active = active === 'true';
    }

    if (showDelegate !== undefined) {
        where.showDelegate = showDelegate === 'true';
    }

    if (showColaborators !== undefined) {
        where.showColaborators = showColaborators === 'true';
    }

if (showAdministrators !== undefined) {
        where.showAdministrators = showAdministrators === 'true';
    }

if (locationFilter) {
        where.displayLocation = locationFilter;
    }

    // Obtener fecha/hora local para evitar problemas de zona horaria
    const now = new Date();
    const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));

    if (hasDateQuery) {
        // Si se proporcionan fechas en la query, usarlas
        const dateFilters = [];

        if (dateStart) {
            dateFilters.push({ dateEnd: { [Op.gte]: new Date(dateStart) } });
        }
        if (dateEnd) {
            dateFilters.push({ dateStart: { [Op.lte]: new Date(dateEnd) } });
        }

        if (dateFilters.length === 1) {
            Object.assign(where, dateFilters[0]);
        } else if (dateFilters.length === 2) {
            where[Op.and] = dateFilters;
        }
    } else {
        // Si NO hay query de fechas, aplicar filtro automático de fechas vigentes
        // Crear fecha de inicio del día de hoy (00:00:00 hora local)
        const todayStart = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate());
        
        // Mostrar anuncios que ya started (dateStart <= final del día de hoy)
        where.dateStart = { [Op.lte]: new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate() + 1) };
        
        // Mostrar anuncios que no han terminado (dateEnd >= inicio del día de hoy)
        where.dateEnd = { [Op.gte]: todayStart };
    }

    const data = await Advice.findAndCountAll({
        where,
        include: [
            {
                model: Users,
                as: "creator",
                attributes: ["id", "email"],
                include: [
                    {
                        model: Census,
                        attributes: ["firstName", "lastName"],
                    },
                ],
            },
        ],
        order: [['createdAt', 'DESC']],
    });

    return data;
};

// Obtener todos los anuncios (admin - sin restricción de fechas)
const getAllAdviceAdminController = async (query = {}) => {
    const { 
        type, 
        active, 
        showDelegate, 
        showColaborators, 
        showAdministrators,
        dateStart,
        dateEnd 
} = query;

    const where = {};

    // Acceptar "location" como alias para displayLocation
    const locationFilter = query.displayLocation || query.location;

    if (type) {
        where.type = type;
    }

    if (active !== undefined) {
        where.active = active === 'true';
    }

    if (showDelegate !== undefined) {
        where.showDelegate = showDelegate === 'true';
    }

    if (showColaborators !== undefined) {
        where.showColaborators = showColaborators === 'true';
    }

if (showAdministrators !== undefined) {
        where.showAdministrators = showAdministrators === 'true';
    }

    if (locationFilter) {
        where.displayLocation = locationFilter;
    }

    if (dateStart || dateEnd) {
        const dateFilters = [];

        if (dateStart) {
            dateFilters.push({ dateEnd: { [Op.gte]: new Date(dateStart) } });
        }
        if (dateEnd) {
            dateFilters.push({ dateStart: { [Op.lte]: new Date(dateEnd) } });
        }

        if (dateFilters.length === 1) {
            Object.assign(where, dateFilters[0]);
        } else if (dateFilters.length === 2) {
            where[Op.and] = dateFilters;
        }
    }

    const data = await Advice.findAndCountAll({
        where,
        include: [
            {
                model: Users,
                as: "creator",
                attributes: ["id", "email"],
                include: [
                    {
                        model: Census,
                        attributes: ["firstName", "lastName"],
                    },
                ],
            },
        ],
        order: [['createdAt', 'DESC']],
    });

    return data;
};

const getAdviceByIdController = async (id) => {
    const advice = await Advice.findOne({
        where: { id },
        include: [
            {
                model: Users,
                as: "creator",
                attributes: ["id", "email"],
                include: [
                    {
                        model: Census,
                        as: "colaborador",
                        attributes: ["firstName", "lastName"],
                    },
                ],
            },
        ],
    });

    return advice;
};

// Crear un nuevo anuncio
const createAdviceController = async (data) => {
    const newAdvice = await Advice.create({
        title: data.title,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        createdBy: data.createdBy,
        image_url: data.image_url || null,
        message: data.message,
        showDelegate: data.showDelegate || false,
        showColaborators: data.showColaborators || false,
        showAdministrators: data.showAdministrators || false,
        active: data.active !== undefined ? data.active : true,
        type: data.type,
        displayLocation: data.displayLocation || null,
    });

    return newAdvice;
};

// Actualizar un anuncio
const updateAdviceController = async (id, data) => {
    const advice = await Advice.findByPk(id);

    if (!advice) {
        throw new Error("Anuncio no encontrado");
    }

    const updatedAdvice = await advice.update({
        title: data.title !== undefined ? data.title : advice.title,
        dateStart: data.dateStart !== undefined ? data.dateStart : advice.dateStart,
        dateEnd: data.dateEnd !== undefined ? data.dateEnd : advice.dateEnd,
        image_url: data.image_url !== undefined ? data.image_url : advice.image_url,
        message: data.message !== undefined ? data.message : advice.message,
        showDelegate: data.showDelegate !== undefined ? data.showDelegate : advice.showDelegate,
        showColaborators: data.showColaborators !== undefined ? data.showColaborators : advice.showColaborators,
        showAdministrators: data.showAdministrators !== undefined ? data.showAdministrators : advice.showAdministrators,
        active: data.active !== undefined ? data.active : advice.active,
        type: data.type !== undefined ? data.type : advice.type,
        displayLocation: data.displayLocation !== undefined ? data.displayLocation : advice.displayLocation,
    });

    return updatedAdvice;
};

// Eliminar un anuncio (soft delete)
const deleteAdviceController = async (id) => {
    const advice = await Advice.findByPk(id);

    if (!advice) {
        throw new Error("Anuncio no encontrado");
    }

    await advice.destroy();

    return { message: "Anuncio eliminado exitosamente", id };
};

// Alternar estado active del anuncio
const toggleAdviceActiveController = async (id) => {
    const advice = await Advice.findByPk(id);

    if (!advice) {
        throw new Error("Anuncio no encontrado");
    }

    const newState = !advice.active;
    await advice.update({ active: newState });

    return { 
        message: `Anuncio ${newState ? 'activado' : 'desactivado'} exitosamente`, 
        id, 
        active: newState 
    };
};

module.exports = {
    getAllAdviceController,
    getAllAdviceAdminController,
    getAdviceByIdController,
    createAdviceController,
    updateAdviceController,
    deleteAdviceController,
    toggleAdviceActiveController,
};
