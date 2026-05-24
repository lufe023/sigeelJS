const Census = require("../models/census.models");
const Users = require("../models/users.models");
const Maps = require("../models/maps.models");
const Benefit = require("../models/benefit.models");
const Job = require("../models/job.models");
const Participation = require("../models/participation.models");
const Gps = require("../models/gps.models");
const Ballot = require("../models/ballot.models");
const Poll = require("../models/poll.models");
const getUser = require("../users/users.controllers");
const Campain = require("../models/campain.models");
const Condition = require("../models/condition.models");
const Ties = require("../models/ties.models");
const TiesTypes = require("../models/tiesTypes.models");
const College = require("../models/college.models");
const Precincts = require("../models/precinct.models");
const AuditLog = require("../models/audit.models");
const { Op, fn, col, where: sequelizeWhere } = require("sequelize");
const Suffrages = require("../models/suffrage.models");
const Provincia = require("../models/provincia.models");
const Municipio = require("../models/municipio.models");
const tiesController = require("../ties/ties.controllers");
const SectorParaje = require("../models/sectorParaje.model");
const Ciudadseccion = require("../models/ciudadseccion.model");
const ProtectedCitizen = require("../models/protectedCitizen.model");
const path = require('path');

const maskProtectedCitizen = (citizen) => {
    if (!citizen) return null;
    const c = citizen.toJSON ? citizen.toJSON() : { ...citizen };

    let baseUrl = process.env.BACKEND_URL || 'http://localhost:9000';
    if (baseUrl.includes('192.168.100.13') || baseUrl.includes('localhost')) {
        baseUrl = baseUrl.replace('https://', 'http://');
    }

    const restrictedImageUrl = `${baseUrl.replace(/\/$/, "")}/uploads/images/system/restringedProfile.png`;

    return {
        ...c,
        // 1. Datos Personales Ofuscados
        citizenID: "00000000000",
        firstName: "RESTRINGIDO",
        lastName: "RESTRINGIDO",
        lastNameB: "RESTRINGIDO",
        nickname: "RESTRINGIDO",
        celphone: "RESTRINGIDO",
        telephone: "RESTRINGIDO",
        otherPhone: "RESTRINGIDO",
        adress: "RESTRINGIDO",
        birthDay: "1900-01-01",
        picture: restrictedImageUrl,
        position: null,
        nombresplastico: null,
        apellidosplastico: null,

        // 2. 🚫 Ofuscación Total de Campos Geográficos Electorales Planos
        province: 0,
        municipality: 0,
        IDSectorParaje: 0,
        IdMunicipioOrigen: null,
        IdRecintoOrigen: null,
        CodigoRecintoOrigen: "00000",
        IdColegioOrigen: null,
        ColegioOrigen: "0000",
        CodigoCircunscripcion: null,
        PrecinctId: null,
        PrecintCode: "00000",
        CollegeId: null,
        CollegeCode: "0000",
        LugarVotacion: null,

        // 3. 🛡️ Vaciado Estricto de Objetos Relacionales Geográficos
        provinces: c.provinces ? { ProvinciaId: 0, Descripcion: "RESTRINGIDO" } : null,
        municipalities: c.municipalities ? { MunicipalityId: 0, description: "RESTRINGIDO", parentMunicipalityId: 0, ProvinciaId: 0 } : null,
        
        sector: c.sector ? {
            SectorParajeId: 0,
            IDCiudadSeccion: 0,
            CodigoSector: "0",
            Descripcion: "RESTRINGIDO",
            ciudadseccion: c.sector.ciudadseccion ? {
                CiudadseccionId: 0,
                idmunicipio: 0,
                iddistritomunicipal: 0,
                codigociudad: "00",
                descripcion: "RESTRINGIDO"
            } : null
        } : null,

        colegio: c.colegio ? {
            CollegeId: 0,
            collegeNumber: "0",
            MunicipalityId: 0,
            PrecinctId: 0,
            TieneCupo: "N",
            precinctData: c.colegio.precinctData ? {
                PrecinctId: 0,
                precintNumber: 0,
                descripcion: "RESTRINGIDO",
                direccionRecinto: "RESTRINGIDO",
                IDSectorParaje: 0,
                IDCircunscripcion: 0
            } : null
        } : null,

        // 4. Otras Relaciones de Gestión
        Beneficios: c.Beneficios ? (Array.isArray(c.Beneficios) ? [] : null) : c.Beneficios,
        Empleos: c.Empleos ? (Array.isArray(c.Empleos) ? [] : null) : c.Empleos,
        Actividades: c.Actividades ? (Array.isArray(c.Actividades) ? [] : null) : c.Actividades,
        Encuestas: c.Encuestas ? (Array.isArray(c.Encuestas) ? [] : null) : c.Encuestas,
        geolocation: c.geolocation ? null : c.geolocation,
        leaders: c.leaders ? null : c.leaders,
        sufragio: c.sufragio ? null : c.sufragio,
        condition: c.condition ? null : c.condition,
        district: null
    };
};

const handleProtection = async (citizen) => {
    if (!citizen) return null;

    // Buscamos en la tabla si la cédula está marcada como protegida
    const isProtected = await ProtectedCitizen.findOne({
        where: { 
            citizenID: citizen.citizenID,
            protected: true 
        },
        attributes: ["id"] // Solo pedimos el ID por velocidad (index scan rápido)
    });

    if (isProtected) {
        return maskProtectedCitizen(citizen);
    }

    return citizen;
};

const { injectPictureUrl: getPictureUrl } = require("../utils/injecPictureUrl");

const injectPictureUrl = (citizen) => {
    if (!citizen) return null;
    const c = citizen.toJSON ? citizen.toJSON() : { ...citizen };

    c.picture = getPictureUrl({
        province: c.province,
        municipality: c.municipality,
        precinct: c.PrecinctId,
        college: c.CollegeId,
        citizenID: c.citizenID
    });

    return c;
};


const getAllCensus = async () => {
    const data = await Census.findAndCountAll({
        include: [
            {
                model: Maps,
                attributes: ["id", "name", "parent"],
                as: "provinces",
            },
            {
                model: Maps,
                attributes: ["id", "name", "parent"],
                as: "municipalities",
            },
            {
                model: Maps,
                attributes: ["id", "name", "parent"],
                as: "districts",
            },
            {
                model: Maps,
                attributes: ["id", "name", "parent"],
                as: "neighbourhoods",
            },
            {
                model: Users,
                attributes: ["id", "email"],
                as: "leaders",
            },
            {
                model: Benefit,
                //attributes: ['id', 'email'],
                as: "Beneficios",
            },
            {
                model: Job,
                //attributes: ['id', 'email'],
                as: "Empleos",
            },
            {
                model: Participation,
                //attributes: ['id', 'email'],
                as: "Actividades",
            },
            {
                model: Gps,
                //attributes: ['id', 'email'],
                as: "geolocation",
            },
            {
                model: Poll,
                //attributes: ['id', 'email'],
                as: "Encuestas",
            },
        ],
    });
    return data;
};

const getMyPeople = async (leaderId) => {
    const data = await Census.findAndCountAll({
        where: {
            leader: leaderId,
        },
        include: [
            {
                model: Suffrages,
                as: "sufragio",
            },
            {
                model: Provincia,
                attributes: ["ProvinciaId", "Descripcion"],
                as: "provinces",
            },
            {
                model: Municipio,
                attributes: [
                    "MunicipalityId",
                    "description",
                    "parentMunicipalityId",
                    "ProvinciaId",
                ],
                as: "municipalities",
            },

            {
                model: Users,
                attributes: ["id", "email"],
                as: "leaders",
            },

            {
                model: Gps,
                //attributes: ['id', 'email'],
                as: "geolocation",
            },
            {
                model: Poll,
                as: "Encuestas",
                where: {
                    active: true,
                },
                required: false, // Hace que la inclusión sea opcional
                include: [
                    {
                        model: Campain,
                        as: "Campain",
                    },
                ],
            },
            {
                model: Condition,
                as: "condition",
            },
            {
                model: College,
                as: "colegio",
                include: [
                    {
                        model: Precincts,
                        as: "precinctData", // Usar el nombre del alias en la relación
                    },
                ],
            },
        ],
    });

    const peopleWithUpdates = [];

    const rows = await Promise.all(data.rows.map(async (citizen) => {
            const citizenId = citizen.citizenID;
            
            // Ejecutamos ambas consultas de auditoría al mismo tiempo
            const [lastUpdatedDates, pendingUpdates] = await Promise.all([
                getLastUpdatedDates(citizenId),
                getPendingUpdatesController(citizenId)
            ]);

            return {
                ...injectPictureUrl(citizen),
                lastUpdatedDates,
                pendingUpdates,
            };
    }));

    return { count: data.count, rows };
};

const getPeopleByUser = async (leaderId) => {
    const peopleData = await getMyPeople(leaderId);

    const user = await getUser.getUserById(leaderId);

    const ties = await tiesController.getPeoplesTiesByCitizenIdController(
        user?.censu?.citizenID,
    );

    return {
        count: peopleData.count,
        rows: peopleData.rows,
        user,
        ties,
    };
};

const getPeopleByUserToPdf = async (leaderId) => {
    const data = await Census.findAndCountAll({
        where: {
            leader: leaderId,
        },
        include: [
            {
                model: Suffrages,
                as: "sufragio",
            },
            {
                model: Maps,
                attributes: ["id", "name", "parent"],
                as: "provinces",
            },
            {
                model: Maps,
                attributes: ["id", "name", "parent"],
                as: "municipalities",
            },
            {
                model: Maps,
                attributes: ["id", "name", "parent"],
                as: "districts",
            },
            {
                model: Maps,
                attributes: ["id", "name", "parent"],
                as: "neighbourhoods",
            },
            {
                model: Users,
                attributes: ["id", "email"],
                as: "leaders",
            },
            {
                model: Benefit,
                //attributes: ['id', 'email'],
                as: "Beneficios",
            },
            {
                model: Job,
                //attributes: ['id', 'email'],
                as: "Empleos",
            },
            {
                model: Participation,
                //attributes: ['id', 'email'],
                as: "Actividades",
            },
            {
                model: Gps,
                //attributes: ['id', 'email'],
                as: "geolocation",
            },
            {
                model: Poll,
                //attributes: ['id', 'citizenID', 'campain'],
                as: "Encuestas",
                include: [{ model: Campain, as: "Campain" }],
            },
            {
                model: Condition,
                as: "condition",
            },
            {
                model: College,
                as: "colegio",
                include: [
                    {
                        model: Precincts,
                        as: "precinctData", // Usar el nombre del alias en la relación
                    },
                ],
            },
        ],
    });

    const peopleWithUpdates = [];

    for (const citizen of data.rows) {
        const citizenId = citizen.citizenID;

        const lastUpdatedDates = await getLastUpdatedDates(citizenId);
        const pendingUpdates = await getPendingUpdatesController(citizenId);

        const citizenWithUpdates = {
            ...citizen.toJSON(),
            lastUpdatedDates,
            pendingUpdates,
        };

        peopleWithUpdates.push(citizenWithUpdates);
    }

    const user = await getUser.getUserById(leaderId);

    const ties = await tiesController.getPeoplesTiesByCitizenIdController(
        user?.censu?.citizenID,
    );

    return {
        count: data.count,
        rows: peopleWithUpdates,
        user,
        ties,
    };
};

const getSimpleCensusController = async (leaderId) => {
    const data = await Census.findAndCountAll({
        where: {
            leader: leaderId,
        },
        include: [
            {
                model: Suffrages,
                as: "sufragio",
            },
            {
                model: Gps,
                //attributes: ['id', 'email'],
                as: "geolocation",
            },
            {
                model: Poll,
                //attributes: ['id', 'citizenID', 'campain'],
                as: "Encuestas",
                include: [{ model: Campain, as: "Campain" }],
            },
            {
                model: Condition,
                as: "condition",
            },
            {
                model: College,
                as: "colegio",
                include: [
                    {
                        model: Precincts,
                        as: "precinctData", // Usar el nombre del alias en la relación
                    },
                ],
            },
        ],
    });

   const rows = await Promise.all(data.rows.map(async (citizen) => {
        const [lastUpdatedDates, pendingUpdates] = await Promise.all([
            getLastUpdatedDates(citizen.citizenID),
            getPendingUpdatesController(citizen.citizenID)
        ]);

        return {
            ...injectPictureUrl(citizen),
            lastUpdatedDates,
            pendingUpdates,
        };
    }));

    return { count: data.count, rows };
};
//getting one People from db
const getOnePeople = async (peopleid) => {
    const data = await Census.findOne({
        where: {
            id: peopleid,
        },

        include: [
            {
                model: Provincia,
                attributes: ["ProvinciaId", "Descripcion"],
                as: "provinces",
            },
            {
                model: Municipio,
                attributes: [
                    "MunicipalityId",
                    "description",
                    "parentMunicipalityId",
                    "ProvinciaId",
                ],
                as: "municipalities",
            },

            {
                model: Users,
                attributes: ["id", "email"],
                as: "leaders",
                include: [
                    {
                        model: Census,
                    },
                ],
            },
            {
                model: Benefit,
                //attributes: ['id', 'email'],
                as: "Beneficios",
            },
            {
                model: Job,
                //attributes: ['id', 'email'],
                as: "Empleos",
            },
            {
                model: Participation,
                //attributes: ['id', 'email'],
                as: "Actividades",
            },
            {
                model: Gps,
                //attributes: ['id', 'email'],
                as: "geolocation",
            },
            {
                model: Poll,
                //attributes: ['id', 'email'],
                as: "Encuestas",
            },
            {
                model: Condition,
                as: "condition",
            },
            {
                model: College,
                as: "colegio",
                include: [
                    {
                        model: Precincts,
                        as: "precinctData",
                    },
                ],
            },
        ],
    });

    if (!data) return null;

const protectedData = await handleProtection(data);
    
    const processedData = injectPictureUrl(protectedData);
    const lastUpdatedDates = await getLastUpdatedDates(processedData.citizenID);
    const pendingUpdates = await getPendingUpdatesController(processedData.citizenID);

    return {
        data: processedData,
        lastUpdatedDates,
        pendingUpdates,
    };
};

const findPeople = async (findWord, allowedIds = [], page = 1, size = 5, filters = {}) => {
    try {
        const limit = parseInt(size);
        const offset = (parseInt(page) - 1) * limit;

        // 1. Condiciones de búsqueda por texto (Nombre, Cédula, Teléfonos)
        let mainConditions = [];
        if (findWord) {
            const looking = findWord.trim().replace(/-/g, "");
            const words = looking.split(/\s+/).filter(Boolean);
            
            mainConditions = words.map((word) => ({
                [Op.or]: [
                    { firstName: { [Op.iLike]: `%${word}%` } },
                    { lastName: { [Op.iLike]: `%${word}%` } },
                    { lastNameB: { [Op.iLike]: `%${word}%` } },
                    { citizenID: { [Op.iLike]: `%${word}%` } },
                    { celphone: { [Op.iLike]: `%${word}%` } }, // Agregamos teléfonos
                    { telephone: { [Op.iLike]: `%${word}%` } },
                ],
            }));
        }

        // 2. Filtros Opcionales Dinámicos
        const extraConditions = {};
        
        if (filters.gender) extraConditions.gender = filters.gender;
        if (filters.IdEstadoCivil) extraConditions.IdEstadoCivil = filters.IdEstadoCivil;
        if (filters.province) extraConditions.province = filters.province;
        if (filters.municipality) extraConditions.municipality = filters.municipality;
        if (filters.IDSectorParaje) extraConditions.IDSectorParaje = filters.IDSectorParaje;
        if (filters.CollegeId) extraConditions.CollegeId = filters.CollegeId;

        // 3. Filtro por Rango de Edad (Cálculo sobre birthDay)
        if (filters.minAge || filters.maxAge) {
            const minAge = filters.minAge || 0;
            const maxAge = filters.maxAge || 120;
            
            // Usamos lógica de Sequelize para calcular la edad actual
            extraConditions.birthDay = sequelizeWhere(
                fn('age', col('birthDay')), 
                { [Op.between]: [fn('make_interval', 0, 0, 0, minAge), fn('make_interval', 0, 0, 0, maxAge)] }
            );
            // Nota: Si usas SQLite o MySQL, la sintaxis de 'age' cambia, pero para PostgreSQL es ideal.
            // Alternativa simple por fechas:
            const today = new Date();
            const dateMin = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate());
            const dateMax = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
            extraConditions.birthDay = { [Op.between]: [dateMin, dateMax] };
        }

        const data = await Census.findAndCountAll({
            limit,
            offset,
            distinct: true,
            where: {
                [Op.and]: [
                    ...mainConditions,
                    extraConditions, // Filtros opcionales
                    { IDSectorParaje: { [Op.in]: allowedIds } }, // Seguridad
                ],
            },
            include: [
                {
                    model: Provincia,
                    attributes: ["ProvinciaId", "Descripcion"],
                    as: "provinces",
                },
                {
                    model: Municipio,
                    attributes: [
                        "MunicipalityId",
                        "description",
                        "parentMunicipalityId",
                        "ProvinciaId",
                    ],
                    as: "municipalities",
                },
                {
                    model: SectorParaje,
                    as: "sector",
                    include: [
                        {
                            model: Ciudadseccion,
                            as: "ciudadseccion",
                        },
                    ],
                },
                {
                    model: Users,
                    attributes: ["id", "email"],
                    as: "leaders",
                    include: [
                        { model: Census, attributes: ["id", "firstName"] },
                    ],
                },
                {
                    model: College,
                    as: "colegio",
                    include: [{ model: Precincts, as: "precinctData" }],
                },
                { model: Suffrages, as: "sufragio" },
            ],
        });

        // Procesamos para agregar "district" solo si aplica
   const processed = await Promise.all(data.rows.map(async (c) => {
    
    // 1. Validamos si está protegido a nivel global
    const protectedCitizen = await handleProtection(c);
    
    // 2. Inyectamos la URL de la foto (si está protegido, cWithPic recibirá null automáticamente)
    const cWithPic = injectPictureUrl(protectedCitizen);

    const sector = cWithPic.sector;
    let district = null;

    if (sector && sector.ciudadseccion) {
        const { idmunicipio, iddistritomunicipal, descripcion, codigociudad } = sector.ciudadseccion;

        if (idmunicipio !== iddistritomunicipal) {
            district = { iddistritomunicipal, idmunicipio, descripcion, codigociudad };
        }
    }

    cWithPic.district = district;
    return cWithPic;
}));

        return { count: data.count, rows: processed };
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
};

const simpleFindPeople = async (findWord, allowedIds = []) => {
    if (!allowedIds || allowedIds.length === 0) {
        return { count: 0, rows: [] };
    }

    const data = await Census.findAndCountAll({
        limit: 5,
        where: {
            [Op.and]: [
                { IDSectorParaje: { [Op.in]: allowedIds } },
                { citizenID: { [Op.iLike]: `%${findWord}%` } },
            ],
        },
        attributes: ["citizenID", "firstName", "lastName", "picture", "municipality", "province", "PrecinctId", "CollegeId"],
    });

    // Validamos protección e inyectamos foto
    const rowsWithPictures = await Promise.all(data.rows.map(async (row) => {
        const protectedRow = await handleProtection(row);
        return injectPictureUrl(protectedRow);
    }));

    return { count: data.count, rows: rowsWithPictures };
};
const addPeople = async (peopleId, leaderId) => {
    const result = await Census.update(
        {
            leader: leaderId,
        },
        {
            where: {
                id: peopleId,
            },
        },
    );
    return result;
};

const removePeople = async (peopleId, leaderId) => {
    const result = await Census.update(
        {
            leader: null,
        },
        {
            where: {
                id: peopleId,
                [Op.and]: {
                    leader: leaderId,
                },
            },
        },
    );

    return result;
};

//pasar el padroncillo de un usuario a otro
const transferCensusController = async (leaderIdA, leaderIdB) => {
    const result = await Census.update(
        {
            leader: leaderIdB,
        },
        {
            where: {
                leader: leaderIdA,
            },
        },
    );
    return result;
};

const updatePeopleController = async (data, citizenID) => {
    try {
        const census = await Census.findOne({
            where: {
                citizenID,
            },
        });

        if (!census) {
            return null; // O maneja el caso de no encontrar el registro como prefieras
        }

        const updatedCensus = await census.update({
            nickname: data.nickname,
            adress: data.adress,
            celphone: data.celphone,
            telephone: data.telephone,
            otherPhone: data.otherPhone,
            outside: data.outside,
        });

        return updatedCensus;
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar el registro");
    }
};

const getPendingUpdatesController = async (citizenId) => {
    if (citizenId === "00000000000") return []; // Cortocircuito de seguridad
    
    const pendingUpdates = await AuditLog.findAll({
        where: {
            recordId: citizenId,
            changedFields: { [Op.ne]: null },
        },
        attributes: ["changedFields", "createdAt"],
        order: [["createdAt", "DESC"]],
    });
    return pendingUpdates;
};

const getLastUpdatedDates = async (citizenID) => {
    if (citizenID === "00000000000") return {}; // Cortocircuito de seguridad
    
    const fields = ["firstName", "lastName", "nickname", "age", "gender"];
    const lastUpdatedDates = {};

    for (const field of fields) {
        const auditLog = await AuditLog.findOne({
            where: {
                tableName: "census",
                recordId: citizenID,
                changedFields: { [field]: { [Op.ne]: null } },
            },
            order: [["createdAt", "DESC"]],
        });

        if (auditLog) {
            lastUpdatedDates[field] = auditLog.createdAt;
        }
    }

    return lastUpdatedDates;
};

const getAllCensusByCollegeController = async (
    collegeId,
    offset,
    limit,
    includeExterior,
) => {
    const whereCondition = {
        CollegeId: collegeId,
    };

    if (includeExterior === "false" || includeExterior === false) {
        whereCondition.outside = {
            [Op.or]: [false, null],
        };
    }

    const data = await Census.findAndCountAll({
        where: whereCondition,
        order: [
            ["position", "ASC"],
            ["id", "ASC"],
        ],
        offset: offset,
        limit: limit,
        attributes: [
            "id",
            "firstName",
            "lastName",
            "nickname",
            "citizenID",
            "picture",
            "position",
            "outside",
            "celphone",
            "telephone",
            "otherPhone",
            "adress",
            "municipality",
            "province", 
            "PrecinctId",
            "CollegeId"
        ],
        include: [
            {
                model: Suffrages,
                as: "sufragio",
            },
            {
                model: Condition,
                as: "condition",
            },
            {
                model: Users,
                attributes: ["id", "email"],
                as: "leaders",
                include: [
                    {
                        model: Census,
                        attributes: ["firstName"],
                    },
                ],
            },
        ],
    });

    const college = await College.findOne({
        where: {
            CollegeId: collegeId,
        },
        include: [
            {
                model: Precincts,
                as: "precinctData",
            },
        ],
    });

    const processedRows = data.rows.map(citizen => injectPictureUrl(citizen));

  return [ { count: data.count, rows: processedRows }, college ];
};

const citizenBirthDay = async (citizenID) => {
    let cedula = citizenID.trim().replace(/-/g, "");

    try {
        if (cedula.length === 11) {
            const data = await Census.findOne({
                where: {
                    citizenID: cedula,
                },
                attributes: ["birthDay"],
            });
            return data.birthDay || "";
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error executing query:", error);
        throw error; // Propaga el error para que se capture en el controlador
    }
};

module.exports = {
    getAllCensus,
    findPeople,
    simpleFindPeople,
    getOnePeople,
    addPeople,
    getMyPeople,
    getPeopleByUser,
    removePeople,

    updatePeopleController,
    getLastUpdatedDates,
    getPendingUpdatesController,
    getAllCensusByCollegeController,
    transferCensusController,
    getSimpleCensusController,
    getPeopleByUserToPdf,
    citizenBirthDay,
};
