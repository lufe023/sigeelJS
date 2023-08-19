const Campain = require('../models/campain.models')
const Maps = require('../models/maps.models')
const Polls = require('../models/poll.models')
const uuid = require('uuid')

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
    getAllCampains,
    createCampains,
}