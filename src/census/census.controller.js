const Census = require('../models/census.models')
const Users = require('../models/users.models')
const Maps = require('../models/maps.models')
const Benefit = require('../models/benefit.models')
const Job = require('../models/job.models')
const Participation = require('../models/participation.models')
const Gps = require('../models/gps.models')
const Ballot = require('../models/ballot.models')
const Poll = require('../models/poll.models')

const {Op} = require("sequelize")

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
                as: 'Encustas'
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
                [Op.like]: `%${findWord}%`
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

module.exports = {
    getAllCensus,
    findPeople
}