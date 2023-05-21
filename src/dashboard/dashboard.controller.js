const Benefit = require('../models/benefit.models')
const Census = require('../models/census.models')
const Gps = require('../models/gps.models')
const Job = require('../models/job.models')
const Participation = require('../models/participation.models')
const Poll = require('../models/poll.models')

const MyTotalCitizens = async (id)=> {
    const citizens =  await Census.findAndCountAll({
        where: {
            leader:id
            },
            attributes: ['id','citizenID', 'district', 'firstName'],
            include:[
                {
                    model: Benefit,
                    as: 'Beneficios'
                },
                {
                    model: Job,
                    as: "Empleos"
                },
                {
                    model: Participation,
                    as: "Actividades"
                },
                {
                    model: Gps,
                    as: "geolocation"
                },
                {
                    model: Poll,
                    as: "Encuestas"
                }
            ]
})

let activities = await citizens.rows.map(obj => obj.Actividades).filter(x=> x > []).length

let beneficios = await citizens.rows.map(obj => obj.Beneficios).filter(x=> x > []).length

let encuestas = await citizens.rows.map(obj => obj.Encuestas)

let completas = 0

/*
    saber cuales encuestas tienen todos los campos que son necesarios para estar completas.
    se evaluan cuales electores pertenecen a un distrito y cuales no para poder tener un resultado correcto.
    !? en caso de que un elector pertenecer a un distrito debe tener completado los campos $districtDirector y $districtCouncilor pero no los campos $mayor y$Councilor
    !? en caso de que un elector pertenecer al municipio mas no al distrito se debe invertir el comentario anterior puesto que todos pertenecen al municipio.
*/
for (let i=0; i < encuestas.length; i++)
    {
        if(encuestas[i][0].preferedParty && encuestas[i][0].electorType && encuestas[i][0].president && encuestas[i][0].senator && encuestas[i][0].diputy)
        {
        
        if(citizens.rows[i].district && encuestas[i][0].districtDirector && encuestas[i][0].districtCouncilor)
        {
            completas++
        }
        if(citizens.rows[i].district ==null && encuestas[i][0].mayor && encuestas[i][0].councillor)
        {
            completas++
        }
        }
    }

//saber cuantas encuestas hay incompletas restandole las completadas a longitud total de las encuestas existentes
let incompletas = encuestas.length - completas
    
const result = {
    // "ciudadanos": citizens,
    // "Activities": activities,
    // "Beneficios": beneficios,
    "Encuestas":{
        "Completas ":completas,
        "Incompletas": incompletas
      
    } 
}

return result
}

const myCitizensParticipations = async (id)=> {
    const total=  await MyTotalCitizens

return total
}

const MyCitizensDataController = async (id) => {

const total = await MyTotalCitizens(id)

const result = [total]
return result
}



module.exports = {
    MyCitizensDataController
}