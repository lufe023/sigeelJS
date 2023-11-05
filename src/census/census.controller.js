const Census = require('../models/census.models')
const Users = require('../models/users.models')
const Maps = require('../models/maps.models')
const Benefit = require('../models/benefit.models')
const Job = require('../models/job.models')
const Participation = require('../models/participation.models')
const Gps = require('../models/gps.models')
const Ballot = require('../models/ballot.models')
const Poll = require('../models/poll.models')
const getUser = require('../users/users.controllers')
const Campain = require('../models/campain.models')
const Condition = require('../models/condition.models')
const Ties = require('../models/ties.models')
const TiesTypes = require('../models/tiesTypes.models')
const College = require('../models/college.models')
const Precincts = require('../models/precinct.models')
const AuditLog = require('../models/audit.models')
const { Sequelize, Op } = require('sequelize');
const Suffrages = require('../models/suffrage.models')

const getPeoplesByPlaces = async (province, municipality) => {
    
    const peoples = await Census.findAndCountAll({
        where: {
            [Op.and]: 
            [
                { province},
                { municipality},
            ]
            },
            attributes: ['citizenID','leader']
    })

    return peoples
}

const getAllCensus = async () => {
    const data = await Census.findAndCountAll({
    

            include :[
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'provinces'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'municipalities'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'districts'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'neighbourhoods'
            },
            {
                model : Users,
                attributes: ['id', 'email'],
                as: 'leaders'
            },
            {
                model : Benefit,
                //attributes: ['id', 'email'],
                as: 'Beneficios'
            },
            {
                model : Job,
                //attributes: ['id', 'email'],
                as: 'Empleos'
            },
            {
                model : Participation,
                //attributes: ['id', 'email'],
                as: 'Actividades'
            },
            {
                model : Gps,
                //attributes: ['id', 'email'],
                as: 'geolocation'
            },
            {
                model : Poll,
                //attributes: ['id', 'email'],
                as: 'Encuestas'
            }

        ]  
})
    return data
}

const getMyPeople = async (leaderId) => {

    const data = await Census.findAndCountAll({
        where:{
            leader:leaderId
        },
            include :[
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'provinces'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'municipalities'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'districts'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'neighbourhoods'
            },
            {
                model : Users,
                attributes: ['id', 'email'],
                as: 'leaders'
            },
            {
                model : Benefit,
                //attributes: ['id', 'email'],
                as: 'Beneficios'
            },
            {
                model : Job,
                //attributes: ['id', 'email'],
                as: 'Empleos'
            },
            {
                model : Participation,
                //attributes: ['id', 'email'],
                as: 'Actividades'
            },
            {
                model : Gps,
                //attributes: ['id', 'email'],
                as: 'geolocation'
            },
            {
                model: Poll,
                as: 'Encuestas',
                where: {
                    active: true
                },
                required: false, // Hace que la inclusión sea opcional
                include: [
                    {
                        model: Campain,
                        as: 'Campain'
                    }
                ]
            },
            {
                model:Condition,
                as: 'condition'
            },
            {model: College,
            as: 'colegio',
            include: [
                {
                model: Precincts,
                as: 'precinctData', // Usar el nombre del alias en la relación
                }
            ]
        },
        ]  
})

const peopleWithUpdates = [];

for (const citizen of data.rows) {
    const citizenId = citizen.citizenID;

    const lastUpdatedDates = await getLastUpdatedDates(citizenId);
    const pendingUpdates = await getPendingUpdatesController(citizenId);

    const citizenWithUpdates = {
        ...citizen.toJSON(),
        lastUpdatedDates,
        pendingUpdates
    };

    peopleWithUpdates.push(citizenWithUpdates);
}

return {
    count: data.count,
    rows: peopleWithUpdates
};
};

const getPeopleByUser = async (leaderId) => {

    const data = await Census.findAndCountAll({
    
        where:{
            leader:leaderId
        },
            include :[
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'provinces'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'municipalities'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'districts'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'neighbourhoods'
            },
            {
                model : Users,
                attributes: ['id', 'email'],
                as: 'leaders'
            },
            {
                model : Benefit,
                //attributes: ['id', 'email'],
                as: 'Beneficios'
            },
            {
                model : Job,
                //attributes: ['id', 'email'],
                as: 'Empleos'
            },
            {
                model : Participation,
                //attributes: ['id', 'email'],
                as: 'Actividades'
            },
            {
                model : Gps,
                //attributes: ['id', 'email'],
                as: 'geolocation'
            },
            {
                model : Poll,
                //attributes: ['id', 'citizenID', 'campain'],
                as: 'Encuestas',
                include:[
                    {model:Campain,
                    as: 'Campain'}
                ]
            },
            {
                model:Condition,
                as: 'condition'
            },
            {model: College,
            as: 'colegio',
            include: [
                {
                model: Precincts,
                as: 'precinctData', // Usar el nombre del alias en la relación
                }
            ]
        },
 
        ]  
})

const peopleWithUpdates = [];

for (const citizen of data.rows) {
    const citizenId = citizen.citizenID;

    const lastUpdatedDates = await getLastUpdatedDates(citizenId);
    const pendingUpdates = await getPendingUpdatesController(citizenId);

    const citizenWithUpdates = {
        ...citizen.toJSON(),
        lastUpdatedDates,
        pendingUpdates
    };

    peopleWithUpdates.push(citizenWithUpdates);
}


const user = await getUser.getUserById(leaderId)
        

return {
    count: data.count,
    rows: peopleWithUpdates,
    user
};

}

//getting one People from db
const getOnePeople = async (peopleid) => {
    const data = await Census.findOne({

        where: {
            id:peopleid
        },
    
            include :[
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'provinces'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'municipalities'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'districts'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'neighbourhoods'
            },
            {
                model : Users,
                attributes: ['id', 'email'],
                as: 'leaders'
            },
            {
                model : Benefit,
                //attributes: ['id', 'email'],
                as: 'Beneficios'
            },
            {
                model : Job,
                //attributes: ['id', 'email'],
                as: 'Empleos'
            },
            {
                model : Participation,
                //attributes: ['id', 'email'],
                as: 'Actividades'
            },
            {
                model : Gps,
                //attributes: ['id', 'email'],
                as: 'geolocation'
            },
            {
                model : Poll,
                //attributes: ['id', 'email'],
                as: 'Encuestas'
            },
            {
                model: Condition,
                as: 'condition'
            },
            {
                model: College,
                as: 'colegio',
                include:[
                    {
                        model:Precincts,
                        as: 'precinctData'
                    }
                ]
            }
        
            
        ]  
})


    const lastUpdatedDates = await getLastUpdatedDates(data.citizenID);
    const pendingUpdates = await getPendingUpdatesController(data.citizenID);


return {
    data,
    lastUpdatedDates,
    pendingUpdates
};


}

const findPeople = async (findWord) => {
    const data = await Census.findAndCountAll({
        limit: 5,
        where:
        {
        [Op.or]:
            {
            firstName: 
            {
                [Op.iLike]: `%${findWord}%`
            },
            lastName: {
                [Op.iLike]: `%${findWord}%`
            },
            citizenID: {
                [Op.iLike]: `%${findWord}%`
            },
            nickname: {
                [Op.iLike]: `%${findWord}%`
            },
            }
        },
        
            include :[
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'provinces'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'municipalities'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'districts'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'neighbourhoods'
            },
            {
                model : Users,
                attributes: ['id', 'email'],
                as: 'leaders',
                include:[
                    {model:Census,
                    attributes:['id','firstName']
                    }
                ]
            },
            {
            model: College,
            as: 'colegio',
            include: [
                {
                model: Precincts,
                as: 'precinctData', // Usar el nombre del alias en la relación
                }
            ]
            }
            
        ]  
})

    return data
}

const simpleFindPeople = async (findWord) => {
    const data = await Census.findAndCountAll({
        limit: 5,
        where:
        {
        [Op.or]:
            {
            citizenID: {
                [Op.iLike]: `%${findWord}%`
            }
            }
        },
        attributes: ['firstName', 'lastName']
})
    return data
}

const addPeople = async (peopleId, leaderId) => {
    const result = await Census.update({
        leader: leaderId,
    },
{
        where: {
            id:peopleId
        }
    })
    return result
}

const removePeople = async (peopleId, leaderId) =>{
    const result = await Census.update(
        {
        leader: null
        }, {
        where:
        {
            id: peopleId,
        [Op.and]:
            {
            leader: leaderId 
            }
        },
    })
    
    return result
}

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
      throw new Error('Error al actualizar el registro');
    }
  };

  const getPendingUpdatesController = async (citizenId) => {
    const pendingUpdates = await AuditLog.findAll({
        where: {
            recordId: citizenId,
            changedFields: {
                [Op.ne]: null,
            },
        },
        attributes: ['changedFields', 'createdAt'],
        order: [['createdAt', 'DESC']],
    });

    return pendingUpdates;
};

  const getLastUpdatedDates = async (citizenID) => {
    const fields = ['firstName', 'lastName', 'nickname', 'age', 'gender', /* ... */];
    const lastUpdatedDates = {};

    for (const field of fields) {
        const auditLog = await AuditLog.findOne({
            where: {
                tableName: 'census',
                recordId: citizenID,
                changedFields: {
                    [field]: { [Op.ne]: null }, // Cambiado a [Op.ne] para buscar campos no nulos
                },
            },
            order: [['createdAt', 'DESC']], // Ordenar por fecha descendente
        });

        if (auditLog) {
            lastUpdatedDates[field] = auditLog.createdAt;
        }
    }

    return lastUpdatedDates;
};

const getAllCensusByCollegeController = async (collegeId, offset, limit, includeExterior) => {
    const whereCondition = {
        college: collegeId,
    };

    if (!includeExterior) {
        whereCondition.outside = false; // Filtrar registros con outside: false
    }

    const data = await Census.findAndCountAll({
        where: whereCondition,
        order: [['position', 'ASC'], ['id', 'ASC']],
        offset: offset,
        limit: limit,
        include: [
            {
                model: Suffrages,
                as: 'sufragio'
            },
            {
                model: Condition,
                as: 'condition'
            },
            {
                model: Users,
                attributes: ['id', 'email'],
                as: 'leaders',
                include: [
                    {
                        model: Census,
                        attributes: ['firstName'],
                    }
                ]
            },
        ]
    });

    const college = await College.findOne({
        where: {
            id: collegeId
        },
        include: [
            {
                model: Precincts,
                as: 'precinctData'
            }
        ]
    });

    return [data, college];
}


module.exports = {
    getAllCensus,
    findPeople,
    simpleFindPeople,
    getOnePeople,
    addPeople,
    getMyPeople,
    getPeopleByUser,
    removePeople,
    getPeoplesByPlaces,
    updatePeopleController,
    getLastUpdatedDates,
    getPendingUpdatesController,
    getAllCensusByCollegeController
}
