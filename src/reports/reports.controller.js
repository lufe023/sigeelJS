const Campain = require('../models/campain.models')
const Poll = require('../models/poll.models')
const Maps = require('../models/maps.models')
const Ballots = require('../models/ballot.models')
const Parties = require('../models/parties.models')
const { Op, Sequelize  } = require('sequelize');
const Census = require('../models/census.models')
const Suffrages = require('../models/suffrage.models')
const College = require('../models/college.models')
const Precincts = require('../models/precinct.models')

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

const bocaUrna = async (college,campain) => {
  
  try {
    // Obtener los citizenID de los registros de Census que tienen suffrage verdadero en Suffrages
    const censusRecords = await Census.findAll({
      where: {
        college: college,
      },
      raw: true,
      attributes: [],
      
      include: [
        {
          model:Suffrages,
          as: 'sufragio',
          where: {
            suffrage: {
              [Sequelize.Op.ne]: null,
            },
          },
          attributes: ['citizenID', 'suffrage', 'updatedAt'] // Ajusta según tus necesidades
        },
        {
          model: Poll,
          as: 'Encuestas',
          where: {
            campain: campain, // Cambiar "id" por "campain" para la condición de la encuesta
            president: {
              [Sequelize.Op.ne]: null,
            },
          },
          //attributes: ['president'], // Si no necesitas ninguna columna específica de la encuesta, puedes omitirla
          include:[
            {model:Ballots,
              as: 'preferedPresidentDetails',
              include:[
                {
                  model: Parties,
                  as: 'partyDetails'
                }
              ]

          }
          ]
        }
      ]
    });


    const datos = await censusRecords
    
    // Creamos un objeto para almacenar los resultados agrupados
    const resultadosAgrupados = {};
    
    // Iteramos sobre cada objeto en el array de datos
    datos.forEach(objeto => {
      const presidente = objeto["Encuestas.president"];
      const name = objeto["Encuestas.preferedPresidentDetails.name"]
      const partyAcronyms = objeto["Encuestas.preferedPresidentDetails.partyDetails.partyAcronyms"]
      const color = objeto["Encuestas.preferedPresidentDetails.partyDetails.color"]
      const hora = new Date(objeto["sufragio.updatedAt"]).getHours(); // Obtener la hora del timestamp
    
      // Creamos una clave única para cada combinación de presidente y hora
      const clave = `${presidente}-${hora}`;
    
      // Si la clave no existe en el objeto de resultados agrupados, la inicializamos a 1, de lo contrario, incrementamos el valor
      if (!resultadosAgrupados[clave]) {
        resultadosAgrupados[clave] = {
          president: presidente,
          name: name,
          partyAcronyms:partyAcronyms,
          color: color,
          hour: hora,
          total: 1,
        };
      } else {
        resultadosAgrupados[clave].total++;
      }
    });
    
    // Convertimos el objeto de resultados agrupados a un array
    const resultadosFinales = Object.values(resultadosAgrupados);


    resultadosFinales.sort((a, b) => a.hour - b.hour);

    return resultadosFinales
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    throw error;
  }
};

const coberturaController = async (precinct)=> {
  
    try {
      // Obtener los citizenID de los registros de Census que tienen suffrage verdadero en Suffrages
      const colleges = await College.findAndCountAll({
        where: {
          precinct: precinct,
        },
        raw: false,
        include:[
          {
            model: Census,
            attributes: ['firstName','lastName', 'citizenID', 'picture', 'position', 'outside'],
            as: 'ColegioCensus',
            where: {
              leader:null,
              [Op.not]:{outside: true}
            },
          }
        ]
      });

      const recinto = await Precincts.findOne({
        where:{
          id: precinct
        }
      })

      return [recinto, colleges]
    } catch (error) {
      // Manejar errores aquí
      console.error(error);
      throw error;
    }
  };


module.exports = {
    getCampainReport,
    getPartyReport,
    getPartyCollegeReportController,
    getPreferedPresidentReportByPlaceController,
    bocaUrna,
    coberturaController
}