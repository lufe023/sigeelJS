const Polls = require('../models/poll.models')
const Campain = require('../models/campain.models')
const uuid = require('uuid')
const Maps = require('../models/maps.models')
const CensusControllers = require('../census/census.controller')
const todoControllers = require('../todo/todo.controller')

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

const createCampains = async (data) => {


    try {
        const newCampain = await Campain.create({
            id: uuid.v4(),
            name: data.name,
            details: data.details,
            neighbourhood: data.neighbourhood,
            distritoMunicipal: data.distrito_municipal,
            municipio: data.municipio,
            provincia: data.provincia,
            createdBy: data.createdBy,
            startAt: data.startAt,
            finishAt: data.startAt
        })
        
        const peoples = await  CensusControllers
        .getPeoplesByPlaces(data.provincia, data.municipio, data.distrito_municipal)
        
        const tareas = []
        const pools = []

            for(let i=0; i<peoples.count; i++)
            {
                
                if(peoples.rows[i].leader !=null)
                {
                let pool = await createPools({
                    citizenID: peoples.rows[i].citizenID,
                    campain: newCampain.id
                })

                pools.push(pool)


                    let tarea = await todoControllers.createTask({
                        title: `Encuesta ${peoples.rows[i].firstName}`,
                        description: `Encuestar a ${peoples.rows[i].firstName} ${peoples.rows[i].lastName} en todos los niveles de la campaña ${newCampain.name} el detalle de la campaña es: ${newCampain.details}`,
                        limit: newCampain.finishAt,
                        isActive: true,
                        responsible: peoples.rows[i].leader,
                        createdBy: newCampain.createdBy
                    })

                        tareas.push(tarea)
                }
            }
        const resultado = [newCampain, peoples, tareas, pools]
        return resultado

    } catch (err) {
        return err
    }


}

module.exports = {
    getAllPolls,
    getAllCampains,
    createCampains
} 