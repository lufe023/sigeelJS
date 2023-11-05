const { QueryTypes } = require('sequelize');

const Campain = require('../models/campain.models')
const Maps = require('../models/maps.models')
const Polls = require('../models/poll.models')
const uuid = require('uuid')
const CensusControllers =  require('../census/census.controller')
const { Op, Sequelize } = require("sequelize");
const sequelize = require('../utils/database');
const Precincts = require('../models/precinct.models')
const College = require('../models/college.models')
const Census = require('../models/census.models')

const getAllCampains = async () => {
    const campains = await Campain.findAll({
        attributes: {
            include: [
                [Sequelize.literal('(SELECT COUNT(*) FROM Polls WHERE Polls.campain = Campain.id)'), 'encuestasCount'],
                [Sequelize.literal('(SELECT COUNT(*) FROM Polls WHERE Polls.campain = Campain.id AND (prefered_party IS NOT NULL OR elector_type IS NOT NULL OR president IS NOT NULL OR senator IS NOT NULL OR diputy IS NOT NULL OR mayor IS NOT NULL OR councillor IS NOT NULL OR "districtDirector" IS NOT NULL OR "districtCouncilor" IS NOT NULL ))'), 'pollWithAnyComplete'],

            ]
        },
        include: [
            {
                model: Maps,
                as: 'provinces'
            },
            {
                model: Maps,
                as: 'municipalities'
            }
        ]
    });

    return campains;
}

const createPools = async(data) => {
    const poll = await Polls.create({
        id: uuid.v4(),
        citizenID: data.citizenID,
        campain: data.campain,
    })
    return poll
}

const createCampains = async (data) =>

{

    try {
        const newCampain = await Campain.create({
            id: uuid.v4(),
            name: data.name,
            details: data.details,
            municipio: data.municipio,
            provincia: data.provincia,
            createdBy: data.createdBy,
            startAt: data.startAt,
            finishAt: data.startAt,
            active:data.isActive
        })
        

        const peoples = await  CensusControllers.getPeoplesByPlaces(data.provincia, data.municipio)
        
        // //const tareas = []
        const pools = []
            for(let i=0; i<peoples.count; i++)
            {
                
                
                let pool = await createPools({
                    citizenID: peoples.rows[i].citizenID,
                    campain: newCampain.id,
                    active:true
                })
                pools.push(pool)
                
            }
        
        return [peoples]

    } catch (err) {
        return err
    }
}

const activeCampainController = async (id, active) => {
    const campainId = id;
    const transaction = await sequelize.transaction();
    try {
        // Desactivar la campaña en la tabla Campain
        await Campain.update(
            { active: active, isActive:active },
            {
                where: {
                    id: campainId
                },
                transaction
            }
        );

        // Desactivar todos los Polls asociados a la campaña en la tabla Polls
        await Polls.update(
            { active: active },
            {
                where: {
                    campain: campainId
                },
                transaction
            }
        );

        // Confirmar la transacción
        await transaction.commit();

        return { success: true, message: 'Campaña y encuestas actualizadas exitosamente.' };
    } catch (error) {
        // Si ocurre un error, deshacer la transacción
        await transaction.rollback();

        return { success: false, message: 'Error al actualizar campaña y encuestas.' };
    }
};

const getCampainsByPlaceController = async (place, col) => {

    //place es el ID del municipio, provincia o distrito municipal, se encutra mas detalles en el modelo maps, Col es la columna
    const campains = await Campain.findAndCountAll({

        
        where:{
            [col]:place
        }
    });

    return campains;
}

// const getCampainsByCollegeController = async (collegeId) => {
//     const campains = await Census.findAll({
//       where: {
//         college: collegeId
//       },
//       attributes: ['citizen_id',],
//       include: [
//         {
//           model: Polls,
//           as: 'Encuestas',
//           attributes: ['id'],
//           include: [
//             {
//               model: Campain,
//               as: 'Campain',
//             //   attributes: ['id', 'otrasColumnasQueQuieras']
//             }
//           ]
//         }
//       ],
//       group: ['census.citizen_id', 'Encuestas.id', 'Encuestas.Campain.id'] // Agrupa por el id de la campaña
//     });
  
//     // Ahora campains contendrá una lista de objetos Campain agrupados por el id de la campaña
  
//     return campains;
//   };
  
const getCampainsByCollegeController = async (collegeId) => {
    const campains = await Census.findAll({
      where: {
        college: collegeId,
      },
      attributes: [
        'Encuestas.Campain.id',
        'Encuestas.Campain.name', 
        'Encuestas.Campain.details', 
        'Encuestas.Campain.start_at',
        'Encuestas.Campain.finish_at',
        'Encuestas.Campain.isActive'], // Incluye la columna que necesitas
      include: [
        {
          model: Polls,
          as: 'Encuestas',
          attributes: [], // No necesitas incluir atributos de Polls
          include: [
            {
              model: Campain,
              as: 'Campain',
              attributes: [], // No necesitas incluir atributos de Campain
            },
          ],
        },
      ],
      group: ['Encuestas.Campain.id'],
      raw: true, // Agrega esta opción
    });
  
    return campains;
  };
  
  

module.exports = {
    getAllCampains,
    createCampains,
    activeCampainController,
    getCampainsByPlaceController,
    getCampainsByCollegeController
}