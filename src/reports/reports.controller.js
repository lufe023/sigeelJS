const Campain = require('../models/campain.models')
const Poll = require('../models/poll.models')
const Maps = require('../models/maps.models')
const Ballots = require('../models/ballot.models')
const Parties = require('../models/parties.models')
const { Op } = require('sequelize');
const Census = require('../models/census.models')

const getCampainReport = async (campainId)=> {
    const report = await Campain.findAll({
        where: {
            id:campainId
        },
        include:[
            {
                model: Maps,
                as: 'municipalities'
            },
            {
                model: Maps,
                as: 'districts'
            },
            {
                model: Poll,
                as: 'encuestas'
            },
        ]
    })

    return report
}

const getPartyCollegeReportController = async (collegeId, campainId) => {
    const reports = await Census.findAll({
      where: {
        college: collegeId
      },
      attributes: [],
      include: [
        {
          model: Poll,
          as: 'Encuestas',
          where: {
            campain: campainId,
            [Op.not]: {preferedParty:null} 
            
          },
          attributes: [
            'citizenID',
            'preferedParty'
          ],
          include: [
            {
              model: Parties,
              as: 'preferedPartyDetails',
              attributes: ['id', 'partyName', 'partyAcronyms', 'color']
            }
          ]
        }
      ]
    });
  

    const campain = await Campain.findAll({
        where: {
            id:campainId
        },
        include:[
            {
                model: Maps,
                as: 'municipalities'
            },
            {
                model: Maps,
                as: 'districts'
            }
        ]
    })


    // Ahora, procesa los resultados para agrupar las encuestas por citizenID
    const encuestasAgrupadas = {};
    reports.forEach((report) => {
      const { citizenID, Encuestas } = report;
      if (!encuestasAgrupadas[citizenID]) {
        encuestasAgrupadas[citizenID] = [];
      }
      // Agrega las preferencias de partido al array de encuestas
      Encuestas.forEach((encuesta) => {
        const { preferedParty, preferedPartyDetails } = encuesta;
        encuestasAgrupadas[citizenID].push({
          preferedParty,
          preferedPartyDetails
        });
      });
    });
  
    return [campain, encuestasAgrupadas];
};


const getPartyReport = async (campainId)=> {
    const report = await Campain.findAll({
        where: {
            id:campainId
        },
        include:[
            {
                model: Maps,
                as: 'municipalities'
            },
            {
                model: Maps,
                as: 'districts'
            },
            {
                model: Poll,
                as: 'encuestas',
                attributes:['preferedParty'],
                where: {
                    '$encuestas.prefered_party$': {
                    [Op.not]: null
                    }
                },
                include:[
                    {
                        model: Parties,
                        as: 'preferedPartyDetails'
                    }
                ],
            },
        ]
    })

    return report
}

const getPreferedPresidentReportByPlaceController = async (campainId) =>{
  const report = await Poll.findAndCountAll({
    where:{
      campain:campainId,
      [Op.not]: {president:null} 
    },
    attributes:['president']
  })

  return report
}

module.exports = {
    getCampainReport,
    getPartyReport,
    getPartyCollegeReportController,
    getPreferedPresidentReportByPlaceController
}