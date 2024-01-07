const College = require("../models/college.models")
const Precincts = require("../models/precinct.models")
const Census = require('../models/census.models')
const uuid = require('uuid');
const Maps = require("../models/maps.models");
const db = require("../utils/database");
const { DataTypes, Op } = require("sequelize");
//? Star Precints area ################################################# Star Precints area ###################################################
//crear un nuevo recinto
const createPrecintController = async (data) => {
    const newPrecint = await Precincts.create({
        id: uuid.v4(),
        precintNumber:data.precintNumber,
        recintoNombre: data.recintoNombre,
        direccionRecinto: data.direccionRecinto,
        latitud: data.latitud,
        longitud:data.longitud,
        electLocal: data.electLocal,
        electExterior: data.electExterior,
        provincia: data.provincia,
        municipio: data.municipio,
        distrito: data.distrito,
        circunscripcion: data.circunscripcion
    })
    return newPrecint
}

//llamar a todos los recintos
const getAllPrecintController = async () => {
    const precints = await Precincts.findAndCountAll({
      order: [
        [{ model: Maps, as: 'PrecinctsMunicipio' }, 'id', 'ASC'],
        ['precintNumber', 'ASC'],
      ],
      
        include:[
            {
                model:College,
                as: 'colegios',
            },
            {
              model: Maps,
              as: 'PrecinctsMunicipio'
            }
        ]
})
    return precints
}

//? End Precints area


//? start College area ################################################# start College area ###################################################

//crear un nuevo Colegio
const createCollegeController = async (data) => {
    const newCollege = await College.create({
        id: uuid.v4(),
        collegeNumber:data.collegeNumber,
        precinct: data.precinct,
        electLocal: data.electLocal,
        electExterior: data.electExterior,
        meta: data.meta
    })
    return newCollege
}

//llamar a todos los Colegios
const getAllCollegeController = async () => {
    const precints = await College.findAndCountAll({

        include:[
            {
                model:Precincts,
                as: 'recinto'
            }
        ]
})
    return precints
}

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

  return 'ready';
};

const getDataConsistencyController = async () => {
  try {
    const precinctsData = await Precincts.findAll({
      order: [
        [{ model: Maps, as: 'PrecinctsMunicipio' }, 'id', 'ASC'],
        ['precintNumber', 'ASC'],
      ],
      
      include: [
        {
          model: College,
          as: 'colegios',
        },
        {
          model: Maps,
          as: 'PrecinctsProvincia'
        },
        {
          model: Maps,
          as: 'PrecinctsMunicipio',
        }
      ],
    });

    const result = await Promise.all(
      precinctsData.map(async (precinct) => {
        const {
          id,
          precintNumber,
          recintoNombre,
          electLocal,
          electExterior,
          colegios,
          PrecinctsProvincia,
          PrecinctsMunicipio
        } = precinct;

        
        const collegeIds = colegios.map((college) => college.id);

        const collegeCitizensPromises = colegios.map(async (college) => {
          const collegeCitizensLocal = await Census.count({
            where: {
              college: college.id,
              outside: { [Op.or]: [false, null] },
            },
          });

          const collegeCitizensExterior = await Census.count({
            where: {
              college: college.id,
              outside: true,
            },
          });

          return {
            ...college.dataValues,
            collegeCitizensLocal,
            collegeCitizensExterior,
          };
        });

        const collegeCitizens = await Promise.all(collegeCitizensPromises);

        return {
          id,
          precintNumber,
          recintoNombre,
          electLocal,
          electExterior,
          PrecinctsProvincia,
          PrecinctsMunicipio,
          localCitizens: await Census.count({
            where: {
              college: collegeIds,
              outside: { [Op.or]: [false, null] },
            },
          }),
          exteriorCitizens: await Census.count({
            where: {
              college: collegeIds,
              outside: true,
            },
          }),
          colegios: collegeCitizens,
        };
      })
    );

    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};



module.exports = {
    createPrecintController,
    getAllPrecintController,
    createCollegeController,
    getAllCollegeController,
    grupalCitizensController,
    getDataConsistencyController
}