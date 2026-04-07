const College = require("../models/college.models");
const Precincts = require("../models/precinct.models");
const Census = require("../models/census.models");
const uuid = require("uuid");
const Municipios = require("../models/municipio.models");

const db = require("../utils/database");
const { DataTypes, Op } = require("sequelize");
const Provincia = require("../models/provincia.models");
const SectorParaje = require("../models/sectorParaje.model");
const Ciudadseccion = require("../models/ciudadseccion.model");
//? Star Precints area ################################################# Star Precints area ###################################################
//crear un nuevo recinto
const createPrecintController = async (data) => {
    const newPrecint = await Precincts.create({
        id: uuid.v4(),
        precintNumber: data.precintNumber,
        recintoNombre: data.recintoNombre,
        direccionRecinto: data.direccionRecinto,
        latitud: data.latitud,
        longitud: data.longitud,
        electLocal: data.electLocal,
        electExterior: data.electExterior,
        provincia: data.provincia,
        municipio: data.municipio,
        distrito: data.distrito,
        circunscripcion: data.circunscripcion,
    });
    return newPrecint;
};

//llamar a todos los recintos
const getAllPrecintController = async (allowedIds = []) => {
    if (!allowedIds || allowedIds.length === 0) {
        return { count: 0, rows: [] };
    }

    // Forzamos que los IDs sean números por si acaso vienen como strings
    const cleanIds = allowedIds.map((id) => Number(id));

    const precints = await Precincts.findAndCountAll({
        where: {
            IDSectorParaje: {
                [Op.in]: cleanIds,
            },
        },
        include: [
            {
                model: College,
                as: "colegios",
            },
            {
                model: SectorParaje,
                as: "PrecinctsSectorParaje",
                include: [
                    {
                        model: Ciudadseccion,
                        as: "ciudadSeccion",
                        include: [
                            {
                                model: Municipios,
                                as: "municipio",
                            },
                        ],
                    },
                ],
            },
        ],
        distinct: true,
    });

    return precints;
};

//? End Precints area

//? start College area ################################################# start College area ###################################################

//crear un nuevo Colegio
const createCollegeController = async (data) => {
    const newCollege = await College.create({
        id: uuid.v4(),
        collegeNumber: data.collegeNumber,
        precinct: data.precinct,
        electLocal: data.electLocal,
        electExterior: data.electExterior,
        meta: data.meta,
    });
    return newCollege;
};

//llamar a todos los Colegios
const getAllCollegeController = async () => {
    const precints = await College.findAndCountAll({
        include: [
            {
                model: Precincts,
                as: "recinto",
            },
        ],
    });
    return precints;
};

//? end College area

//? start registrando Ciudadanos ################################################# registrando Ciudadanos ###################################################

const grupalCitizensController = async (citizens, uniqueFilenames) => {
    await citizens.forEach((element, index) => {
        const citizen = JSON.parse(element);
        const uniqueFilename = uniqueFilenames[index];

        Census.create({
            id: uuid.v4(),
            firstName: citizen.firstName,
            lastName: citizen.lastName,
            citizenID: citizen.citizenID,
            province: citizen.province,
            municipality: citizen.municipality,
            district: citizen.district,
            position: citizen.position,
            address: citizen.address,
            outside: citizen.outside,
            telephone: citizen.telephone,
            celphone: citizen.celphone,
            college: citizen.college,
            picture: uniqueFilename,
        });
    });

    return "ready";
};

const grupalCitizensControllerB = async (citizens, uniqueFilenames) => {
    for (let index = 0; index < citizens.length; index++) {
        const citizen = JSON.parse(citizens[index]);
        const uniqueFilename = uniqueFilenames[index];

        // Buscar si ya existe un ciudadano con el mismo citizenID
        const existingCitizen = await Census.findOne({
            where: { citizenID: citizen.citizenID },
        });

        if (existingCitizen) {
            //Si el ciudadano ya existe, actualiza los campos necesarios
            existingCitizen.firstName = citizen.firstName;
            existingCitizen.lastName = citizen.lastName;
            existingCitizen.position = citizen.position;
            existingCitizen.picture = uniqueFilename;
            existingCitizen.province = citizen.province;
            existingCitizen.municipality = citizen.municipality;
            existingCitizen.district = citizen.district;
            existingCitizen.college = citizen.college;

            // Guarda los cambios en el ciudadano existente
            await existingCitizen.save();
        } else {
            // Si el ciudadano no existe, crea uno nuevo
            await Census.create({
                id: uuid.v4(),
                firstName: citizen.firstName,
                lastName: citizen.lastName,
                citizenID: citizen.citizenID,
                province: citizen.province,
                municipality: citizen.municipality,
                district: citizen.district,
                position: citizen.position,
                college: citizen.college,
                picture: uniqueFilename,
            });
        }
    }

    return "ready";
};

const newCitizenController = async (citizen, filename) => {
    citizen = JSON.parse(citizen);
    const newCitizen = await Census.create({
        id: uuid.v4(),
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        citizenID: citizen.citizenID,
        province: citizen.province,
        municipality: citizen.municipality,
        district: citizen.district,
        position: citizen.position,
        address: citizen.address,
        outside: citizen.outside,
        telephone: citizen.telephone,
        celphone: citizen.celphone,
        college: citizen.college,
        picture: filename,
    });
    return newCitizen;
};

const getDataConsistencyController = async () => {
    // 1. Trae solo lo necesario y como objetos planos (raw)
    const precinctsData = await Precincts.findAll({
        include: [
            { model: College, as: "colegios" },
            { model: Maps, as: "PrecinctsProvincia" },
            { model: Maps, as: "PrecinctsMunicipio" }
        ],
        raw: false, // Necesitamos false si usas métodos de instancia, pero mejor procesa a mano
        nest: true
    });

    // 2. En lugar de miles de counts, podrías hacer una sola consulta 
    // agrupada por colegio para obtener todos los totales de una vez.
    
    // 3. Procesa en bloques o secuencialmente
    const finalResult = [];
    for (const p of precinctsData) {
        const plainPrecinct = p.get({ plain: true }); // Convierte a objeto simple
        
        // Ejecuta los conteos pero de forma controlada
        const collegeIds = plainPrecinct.colegios.map(c => c.id);
        
        // Usa una sola consulta para contar todo lo del recinto
        const counts = await Census.findAll({
            attributes: [
                'outside',
                [db.fn('COUNT', db.col('id')), 'total']
            ],
            where: { college: collegeIds },
            group: ['outside'],
            raw: true
        });

        finalResult.push({
            ...plainPrecinct,
            counts // Procesa estos totales en JS simple
        });
    }
    return finalResult;
};

module.exports = {
    createPrecintController,
    getAllPrecintController,
    createCollegeController,
    getAllCollegeController,
    grupalCitizensController,
    getDataConsistencyController,
    newCitizenController,
    grupalCitizensControllerB,
};
