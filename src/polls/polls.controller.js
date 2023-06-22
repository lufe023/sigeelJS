const Polls = require('../models/poll.models')
const Campain = require('../models/campain.models')
const uuid = require('uuid')
const Maps = require('../models/maps.models')
const CensusControllers = require('../census/census.controller')
const todoControllers = require('../todo/todo.controller')
const Census = require('../models/census.models')
const Ballot = require('../models/ballot.models')

const {Op} = require("sequelize")
const Parties = require('../models/parties.models')

const getAllPolls = async () => {
    const data = await Polls.findAll({
    })
    return data
}

const getAllCampains = async()=>{
    const campains = await Campain.findAndCountAll({
        include:[
            {
                model : Maps,
                as: 'provinces'
            },
            {
                model : Maps,
                as: 'municipalities'
            },
            { 
                model: Maps,
                as: 'districts'
            },
            {
                model: Maps,
                as: 'neighbourhoods'
            }
        ]
    }
    )

    return campains
}

const createPools = async(data) => {
    const poll = await Polls.create({
        id: uuid.v4(),
        citizenID: data.citizenID,
        campain: data.campain,
    })
    return poll
}

//actualizacion de los datos de una ecuesta por id que pertenece a un elector
const updatePollController = async(pollId, data) => {
    const poll = await Polls.update(data,{ 
        where: {
            id: pollId
        }
        })
    return poll
}



const getPollById = async (id) =>{
    const poll = await Polls.findOne({
        where: {
            id
        },
        attributes: {exclude: ['password']},
        include :[
            //debo hacer una peticion a Census para pedir datos del usuario que estan en el padron
            {
                model : Census,
                as: 'citizen'
            },
            { 
                model: Campain,
                as: 'Campain'
            }
        ]
    })

    
    const candidate = await Ballot.findAndCountAll({
        where: {
            [Op.and]: 
            [
                
                { provincia: poll.Campain.provincia},
                { municipio: poll.Campain.municipio},
                {distritoMunicipal: poll.Campain.distritoMunicipal}
            ]
    },
    include :[
        //debo hacer una peticion a Census para pedir datos del usuario que estan en el padron
        {
            model : Parties,
            as: 'partyDetails'
        }
    ]
})

    const parties = await Parties.findAndCountAll()

    const resultado = [poll, {"availablesCandidates": candidate}, {"parties": parties}]
    return resultado
}

const createCampains = async (data) => {


    try {
        const newCampain = await Campain.create({
            id: uuid.v4(),
            name: data.name,
            details: data.details,
            neighbourhood: data.neighbourhood,
            distrito_municipal: data.distrito_municipal,
            municipio: data.municipio,
            provincia: data.provincia,
            createdBy: data.createdBy,
            startAt: data.startAt,
            finishAt: data.startAt
        })
        

        const peoples = await  CensusControllers.getPeoplesByPlaces(data.provincia, data.municipio, data.distrito_municipal)
        
      
        const pools = []

        const tarea = await todoControllers.createTask({
            title: `${newCampain.name} `,
            description: `Encuesta en todos los niveles de la campaña ${newCampain.name} a todas las personas dentro del modulo Mi Gente ${newCampain.details}`,
            limit: newCampain.finishAt,
            isActive: true,
            responsible: peoples.rows[0].leader,
            createdBy: newCampain.createdBy
        })


            for(let i=0; i<peoples.count; i++)
            {
                
                if(peoples.rows[i].leader !=null)
                {
                let pool = await createPools({
                    citizenID: peoples.rows[i].citizenID,
                    campain: newCampain.id
                })

                pools.push(pool)
                
                }
            }
        const resultado = [newCampain, peoples, pools, tarea]
        return resultado

    } catch (err) {
        return err
    }


}

module.exports = {
    getAllPolls,
    getAllCampains,
    createCampains,
    getPollById,
    updatePollController
} 