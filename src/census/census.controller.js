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
const {Op} = require("sequelize")

const getPeoplesByPlaces = async (province, municipality, district) => {
    
    const peoples = await Census.findAndCountAll({
        where: {
            [Op.and]: 
            [
                { province},
                { municipality},
                {district}
            ]
            },
            attributes: ['firstName','lastName','citizenID','leader']
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
                model : Poll,
                //attributes: ['id', 'citizenID', 'campain'],
                as: 'Encuestas'
            }
        ]  
})
    return data
}

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
                as: 'Encuestas'
            }
        ]  
})

const user = await getUser.getUserById(leaderId)
            

    return [data,user]
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
            }



        ]  
})
    return data
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
                as: 'leaders'
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
    const result = await Census.update({
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


module.exports = {
    getAllCensus,
    findPeople,
    simpleFindPeople,
    getOnePeople,
    addPeople,
    getMyPeople,
    getPeopleByUser,
    removePeople,
    getPeoplesByPlaces
}