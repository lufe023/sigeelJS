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
const Users = require('../models/users.models')
const Municipio = require('../models/municipio.models')
const SectorParaje = require('../models/sectorParaje.model')
const Ciudadseccion = require('../models/ciudadseccion.model')

const roundPercentage = (value, total) => {
    if (!total) return 0;

    return Number(((value / total) * 100).toFixed(2));
};

const resolveMetaGoal = (electLocal, meta) => {
    const localElectors = Number(electLocal) || 0;
    const rawMeta = Number(meta) || 0;

    if (!rawMeta) {
        return {
            metaConfigured: false,
            metaType: null,
            metaTarget: 0,
            metaPercent: 0,
        };
    }

    if (rawMeta <= 100) {
        return {
            metaConfigured: true,
            metaType: 'percentage',
            metaTarget: Math.ceil((localElectors * rawMeta) / 100),
            metaPercent: rawMeta,
        };
    }

    return {
        metaConfigured: true,
        metaType: 'absolute',
        metaTarget: rawMeta,
        metaPercent: roundPercentage(rawMeta, localElectors),
    };
};

const buildLeaderLocationScope = ({ municipalityId, districtId }) => {
    const where = {};
    const include = [
        {
            model: SectorParaje,
            as: 'sector',
            attributes: [
                'SectorParajeId',
                'CodigoSector',
                'Descripcion',
                'IDCiudadSeccion',
            ],
            required: Boolean(districtId),
            include: [
                {
                    model: Ciudadseccion,
                    as: 'ciudadseccion',
                    attributes: [
                        'CiudadseccionId',
                        'idmunicipio',
                        'iddistritomunicipal',
                        'descripcion',
                    ],
                    required: Boolean(districtId),
                    where: districtId
                        ? {
                            iddistritomunicipal: districtId,
                        }
                        : undefined,
                },
            ],
        },
    ];

    if (municipalityId) {
        where.municipality = municipalityId;
    }

    return { where, include };
};

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

const bocaUrnaAlcalde = async (college,campain) => {
  
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
            mayor: {
              [Sequelize.Op.ne]: null,
            },
          },
          //attributes: ['president'], // Si no necesitas ninguna columna específica de la encuesta, puedes omitirla
          include:[
            {model:Ballots,
              as: 'preferedMayorDetails',
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
      const alcalde = objeto["Encuestas.mayor"];
      const name = objeto["Encuestas.preferedMayorDetails.name"]
      const partyAcronyms = objeto["Encuestas.preferedMayorDetails.partyDetails.partyAcronyms"]
      const color = objeto["Encuestas.preferedMayorDetails.partyDetails.color"]
      const hora = new Date(objeto["sufragio.updatedAt"]).getHours(); // Obtener la hora del timestamp
    console.log("alcalde" + alcalde)
      // Creamos una clave única para cada combinación de presidente y hora
      const clave = `${alcalde}-${hora}`;
    
      // Si la clave no existe en el objeto de resultados agrupados, la inicializamos a 1, de lo contrario, incrementamos el valor
      if (!resultadosAgrupados[clave]) {
        resultadosAgrupados[clave] = {
          president: alcalde,
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

const getPrecinctCoverageReportController = async (precinctId)=> {
    try {
      const recinto = await Precincts.findOne({
        where:{
          PrecinctId: precinctId
        },
        attributes: [
          'PrecinctId',
          'precintNumber',
          'descripcion',
          'direccionRecinto',
          'electLocal',
          'electExterior',
          'circunscripcion',
        ],
      })

      if (!recinto) {
        return null
      }

      const colleges = await College.findAll({
        where: {
          PrecinctId: precinctId,
        },
        attributes: [
          'CollegeId',
          'collegeNumber',
          'description',
          'PrecinctId',
          'electLocal',
          'electExterior',
          'meta',
        ],
        order: [['collegeNumber', 'ASC']],
      });

      const collegeIds = colleges.map((college) => college.CollegeId)

      const assignedByCollege = collegeIds.length > 0
        ? await Census.findAll({
          where: {
            CollegeId: {
              [Op.in]: collegeIds,
            },
            leader: {
              [Op.ne]: null,
            },
          },
          attributes: [
            'CollegeId',
            [Sequelize.fn('COUNT', Sequelize.literal('*')), 'padroncilloTotal'],
            [
              Sequelize.fn(
                'SUM',
                Sequelize.literal('CASE WHEN "outside" = true THEN 0 ELSE 1 END')
              ),
              'padroncilloLocal',
            ],
            [
              Sequelize.fn(
                'SUM',
                Sequelize.literal('CASE WHEN "outside" = true THEN 1 ELSE 0 END')
              ),
              'padroncilloExterior',
            ],
          ],
          group: ['CollegeId'],
          raw: true,
        })
        : [];

      const assignedMap = new Map(
        assignedByCollege.map((row) => [
          Number(row.CollegeId),
          {
            padroncilloTotal: Number(row.padroncilloTotal) || 0,
            padroncilloLocal: Number(row.padroncilloLocal) || 0,
            padroncilloExterior: Number(row.padroncilloExterior) || 0,
          },
        ])
      )

      const collegesReport = colleges.map((college) => {
        const baseCollege = college.toJSON()
        const electLocal = Number(baseCollege.electLocal) || 0
        const electExterior = Number(baseCollege.electExterior) || 0
        const counts = assignedMap.get(baseCollege.CollegeId) || {
          padroncilloTotal: 0,
          padroncilloLocal: 0,
          padroncilloExterior: 0,
        }
        const metaGoal = resolveMetaGoal(electLocal, baseCollege.meta)
        const pendingToMeta = metaGoal.metaConfigured
          ? Math.max(metaGoal.metaTarget - counts.padroncilloLocal, 0)
          : null

        return {
          ...baseCollege,
          padroncillo: {
            local: counts.padroncilloLocal,
            exterior: counts.padroncilloExterior,
            total: counts.padroncilloTotal,
          },
          coverage: {
            localCoveragePercent: roundPercentage(
              counts.padroncilloLocal,
              electLocal
            ),
            exteriorCoveragePercent: roundPercentage(
              counts.padroncilloExterior,
              electExterior
            ),
            metaConfigured: metaGoal.metaConfigured,
            metaType: metaGoal.metaType,
            metaPercent: metaGoal.metaPercent,
            metaTarget: metaGoal.metaTarget,
            metaReached: metaGoal.metaConfigured
              ? counts.padroncilloLocal >= metaGoal.metaTarget
              : null,
            pendingToMeta,
            metaProgressPercent: metaGoal.metaConfigured
              ? roundPercentage(counts.padroncilloLocal, metaGoal.metaTarget)
              : null,
          },
        }
      })

      const summary = collegesReport.reduce(
        (acc, college) => {
          acc.collegeCount += 1
          acc.electLocal += Number(college.electLocal) || 0
          acc.electExterior += Number(college.electExterior) || 0
          acc.padroncilloLocal += college.padroncillo.local
          acc.padroncilloExterior += college.padroncillo.exterior
          acc.padroncilloTotal += college.padroncillo.total

          if (college.coverage.metaConfigured) {
            acc.metaConfiguredColleges += 1
            acc.metaTarget += college.coverage.metaTarget
            acc.pendingToMeta += college.coverage.pendingToMeta

            if (college.coverage.metaReached) {
              acc.metaReachedColleges += 1
            }
          }

          return acc
        },
        {
          collegeCount: 0,
          electLocal: 0,
          electExterior: 0,
          padroncilloLocal: 0,
          padroncilloExterior: 0,
          padroncilloTotal: 0,
          metaConfiguredColleges: 0,
          metaReachedColleges: 0,
          metaTarget: 0,
          pendingToMeta: 0,
        }
      )

      return {
        precinct: recinto.toJSON(),
        summary: {
          ...summary,
          localCoveragePercent: roundPercentage(
            summary.padroncilloLocal,
            summary.electLocal
          ),
          exteriorCoveragePercent: roundPercentage(
            summary.padroncilloExterior,
            summary.electExterior
          ),
          metaReached:
            summary.metaConfiguredColleges > 0
              ? summary.pendingToMeta === 0
              : null,
          metaProgressPercent:
            summary.metaConfiguredColleges > 0
              ? roundPercentage(summary.padroncilloLocal, summary.metaTarget)
              : null,
        },
        colleges: collegesReport,
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

const getLeaderCoverageReportController = async ({
    municipalityId,
    districtId,
    leaderGoal = 10,
}) => {
    const normalizedMunicipalityId = municipalityId ? Number(municipalityId) : null;
    const normalizedDistrictId = districtId ? Number(districtId) : null;
    const parsedGoal = Number(leaderGoal);
    const normalizedGoal = Number.isFinite(parsedGoal) && parsedGoal > 0
        ? parsedGoal
        : 10;
    const scope = buildLeaderLocationScope({
        municipalityId: normalizedMunicipalityId,
        districtId: normalizedDistrictId,
    });

    const [municipality, district] = await Promise.all([
        normalizedMunicipalityId
            ? Municipio.findOne({
                where: { MunicipalityId: normalizedMunicipalityId },
                attributes: ['MunicipalityId', 'description', 'parentMunicipalityId', 'dm'],
            })
            : null,
        normalizedDistrictId
            ? Municipio.findOne({
                where: { MunicipalityId: normalizedDistrictId },
                attributes: ['MunicipalityId', 'description', 'parentMunicipalityId', 'dm'],
            })
            : null,
    ]);

    const leaders = await Census.findAll({
        where: scope.where,
        attributes: [
            'citizenID',
            'firstName',
            'lastName',
            'nickname',
            'municipality',
            'IDSectorParaje',
        ],
        include: [
            {
                model: Users,
                as: 'colaborador',
                required: true,
                attributes: ['id', 'email', 'userRoleId', 'active', 'censuCitizenID'],
            },
            {
                model: Municipio,
                as: 'municipalities',
                required: false,
                attributes: ['MunicipalityId', 'description', 'parentMunicipalityId', 'dm'],
            },
            ...scope.include,
        ],
        order: [
            ['firstName', 'ASC'],
            ['lastName', 'ASC'],
        ],
    });

    const affiliatedCounts = await Census.findAll({
        where: {
            ...scope.where,
            leader: {
                [Op.ne]: null,
            },
        },
        attributes: [
            'leader',
            [Sequelize.fn('COUNT', Sequelize.literal('*')), 'affiliatedCount'],
        ],
        include: scope.include.map((includeItem) => ({
            ...includeItem,
            attributes: [],
            include: includeItem.include.map((nestedInclude) => ({
                ...nestedInclude,
                attributes: [],
            })),
        })),
        group: ['leader'],
        raw: true,
    });

    const affiliatedMap = new Map(
        affiliatedCounts.map((row) => [
            row.leader,
            Number(row.affiliatedCount) || 0,
        ])
    );

    const rows = leaders.map((leaderCensus) => {
        const leader = leaderCensus.toJSON();
        const affiliatedCount = affiliatedMap.get(leader.colaborador.id) || 0;
        const missingToGoal = Math.max(normalizedGoal - affiliatedCount, 0);

        return {
            leaderId: leader.colaborador.id,
            email: leader.colaborador.email,
            userRoleId: leader.colaborador.userRoleId,
            active: leader.colaborador.active,
            censuCitizenID: leader.colaborador.censuCitizenID,
            citizenID: leader.citizenID,
            firstName: leader.firstName,
            lastName: leader.lastName,
            nickname: leader.nickname,
            municipality: leader.municipalities || null,
            citySection: leader.sector?.ciudadseccion || null,
            sector: leader.sector || null,
            affiliatedCount,
            leaderGoal: normalizedGoal,
            goalReached: affiliatedCount >= normalizedGoal,
            missingToGoal,
        };
    });

    const summary = rows.reduce(
        (acc, row) => {
            acc.totalLeaders += 1;
            acc.totalAffiliated += row.affiliatedCount;

            if (row.goalReached) {
                acc.goalReachedCount += 1;
            } else {
                acc.goalPendingCount += 1;
            }

            return acc;
        },
        {
            totalLeaders: 0,
            totalAffiliated: 0,
            goalReachedCount: 0,
            goalPendingCount: 0,
        }
    );

    rows.sort((a, b) => {
        if (b.affiliatedCount !== a.affiliatedCount) {
            return b.affiliatedCount - a.affiliatedCount;
        }

        return `${a.firstName || ''} ${a.lastName || ''}`.localeCompare(
            `${b.firstName || ''} ${b.lastName || ''}`
        );
    });

    return {
        filters: {
            municipalityId: normalizedMunicipalityId,
            districtId: normalizedDistrictId,
            leaderGoal: normalizedGoal,
        },
        location: {
            municipality,
            district,
        },
        summary,
        leaders: rows,
    };
};

  

module.exports = {
    getCampainReport,
    getPartyReport,
    getPartyCollegeReportController,
    getPreferedPresidentReportByPlaceController,
    bocaUrna,
    getPrecinctCoverageReportController,
    getLeaderCoverageReportController,
    bocaUrnaAlcalde
}
