const Benefit = require('../models/benefit.models')
const Census = require('../models/census.models')
const Gps = require('../models/gps.models')
const Job = require('../models/job.models')
const Participation = require('../models/participation.models')
const Parties = require('../models/parties.models')
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



/*
    saber cuales encuestas tienen todos los campos que son necesarios para estar completas.
    se evaluan cuales electores pertenecen a un distrito y cuales no para poder tener un resultado correcto.
    !? en caso de que un elector pertenecer a un distrito debe tener completado los campos $districtDirector y $districtCouncilor pero no los campos $mayor y$Councilor
    !? en caso de que un elector pertenecer al municipio mas no al distrito se debe invertir el comentario anterior puesto que todos pertenecen al municipio.
*/

let completas = 0

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


//!? #inicio sacando los votos de los partidos preferidos
    const preferedPartyArray = []

    let preferedParty =  encuestas.map(x => x[0]).map(x=>x.preferedParty)
    let lookingParty
    
    for (let i=0; i < preferedParty.length; i++){ 
        if(preferedParty[i]){
            lookingParty = preferedPartyArray.findIndex(arr => arr.party ===preferedParty[i])
            if(lookingParty ==-1 ){
                preferedPartyArray.push({party: preferedParty[i], total: 1})
            }else{
                preferedPartyArray[lookingParty].total = preferedPartyArray[lookingParty].total+1
            }
        }
    }
//Fin sacando los votos de los partidos preferidos


//!? #inicio Sacando los votos de los presidentes preferidos
const preferedPresidentArray = []

let preferedPresident =  encuestas.map(x => x[0]).map(x=>x.president)
let lookingPresident

for (let i=0; i < preferedPresident.length; i++){ 
    if(preferedPresident[i]){
        lookingPresident = preferedPresidentArray.findIndex(arr => arr.president ===preferedPresident[i])
        if(lookingPresident ==-1 ){
            preferedPresidentArray.push({president: preferedPresident[i], total: 1})
        }else{
            preferedPresidentArray[lookingPresident].total = preferedPresidentArray[lookingPresident].total+1
        }
    }
}
//Fin sacando los votos de los presidentes preferidos


//!? #inicio Sacando los votos de los senadores preferidos
const preferedSenatorArray = []

let preferedSenator =  encuestas.map(x => x[0]).map(x=>x.senator)
let lookingSenator

for (let i=0; i < preferedSenator.length; i++){ 
    if(preferedSenator[i]){
        lookingSenator = preferedSenatorArray.findIndex(arr => arr.senator ===preferedSenator[i])
        if(lookingSenator ==-1 ){
            preferedSenatorArray.push({senator: preferedSenator[i], total: 1})
        }else{
            preferedSenatorArray[lookingSenator].total = preferedSenatorArray[lookingSenator].total+1
        }
    }
}
//Fin sacando los votos de los senadores preferidos

//!? #inicio Sacando los votos de los diputados preferidos
const preferedDiputyArray = []

let preferedDiputy =  encuestas.map(x => x[0]).map(x=>x.diputy)
let lookingDiputy

for (let i=0; i < preferedDiputy.length; i++){ 
    if(preferedDiputy[i]){
        lookingDiputy = preferedDiputyArray.findIndex(arr => arr.diputy ===preferedDiputy[i])
        if(lookingDiputy ==-1 ){
            preferedDiputyArray.push({diputy: preferedDiputy[i], total: 1})
        }else{
            preferedDiputyArray[lookingDiputy].total = preferedDiputyArray[lookingDiputy].total+1
        }
    }
}
//Fin sacando los votos de los diputados preferidos

//!? #inicio Sacando los votos de los alcaldes preferidos
const preferedMayorArray = []

let preferedMayor =  encuestas.map(x => x[0]).map(x=>x.mayor)
let lookingMayor

for (let i=0; i < preferedMayor.length; i++){ 
    if(preferedMayor[i]){
        lookingMayor = preferedMayorArray.findIndex(arr => arr.mayor ===preferedMayor[i])
        if(lookingMayor ==-1 ){
            preferedMayorArray.push({mayor: preferedMayor[i], total: 1})
        }else{
            preferedMayorArray[lookingMayor].total = preferedMayorArray[lookingMayor].total+1
        }
    }
}
//Fin sacando los votos de los alcaldes preferidos


//!? #inicio Sacando los votos de los regidores preferidos
const preferedCouncillorArray = []

let preferedCouncillor =  encuestas.map(x => x[0]).map(x=>x.councillor)
let lookingCouncillor

for (let i=0; i < preferedCouncillor.length; i++){ 
    if(preferedCouncillor[i]){
        lookingCouncillor = preferedCouncillorArray.findIndex(arr => arr.councillor ===preferedCouncillor[i])
        if(lookingCouncillor ==-1 ){
            preferedCouncillorArray.push({councillor: preferedCouncillor[i], total: 1})
        }else{
            preferedCouncillorArray[lookingCouncillor].total = preferedCouncillorArray[lookingCouncillor].total+1
        }
    }
}
//Fin sacando los votos de los regidores preferidos

//!? #inicio Sacando los votos de los Directores Distritales preferidos
const preferedDistrictDirectorArray = []

let preferedDistrictDirector =  encuestas.map(x => x[0]).map(x=>x.districtDirector)
let lookingDistrictDirector

for (let i=0; i < preferedDistrictDirector.length; i++){ 
    if(preferedDistrictDirector[i]){
        lookingDistrictDirector = preferedDistrictDirectorArray.findIndex(arr => arr.districtDirector ===preferedDistrictDirector[i])
        if(lookingDistrictDirector ==-1 ){
            preferedDistrictDirectorArray.push({districtDirector: preferedDistrictDirector[i], total: 1})
        }else{
            preferedDistrictDirectorArray[lookingDistrictDirector].total = preferedDistrictDirectorArray[lookingDistrictDirector].total+1
        }
    }
}
//Fin sacando los votos de los Directores Distritales preferidos

//!? #inicio Sacando los votos de los vocales distritales preferidos
const preferedDistrictCouncillorArray = []

let preferedDistrictCouncillor =  encuestas.map(x => x[0]).map(x=>x.districtCouncilor)
let lookingDistrictCouncillor

for (let i=0; i < preferedDistrictCouncillor.length; i++){ 
    if(preferedDistrictCouncillor[i]){
        lookingDistrictCouncillor = preferedDistrictCouncillorArray.findIndex(arr => arr.councillor ===preferedDistrictCouncillor[i])
        if(lookingDistrictCouncillor ==-1 ){
            preferedDistrictCouncillorArray.push({councillor: preferedDistrictCouncillor[i], total: 1})
        }else{
            preferedDistrictCouncillorArray[lookingDistrictCouncillor].total = preferedDistrictCouncillorArray[lookingDistrictCouncillor].total+1
        }
    }
}
//Fin sacando los votos de los vocales distritales preferidos

const result = {
    // "ciudadanos": citizens,
    // "Activities": activities,
    // "Beneficios": beneficios,
    // "Encuestas":{
    //     "total":encuestas.length,
    //     "Completas ":completas,
    //     "Incompletas": incompletas,
    //     "porciento Completada": Math.round(completas/encuestas.length*100),
    //     "porciento Incompletada": Math.round(incompletas/encuestas.length*100)
    // },
    "preferedParty": preferedPartyArray,
    "preferedPresident": preferedPresidentArray,
    "preferedSenator": preferedSenatorArray,
    "preferedDiputy": preferedDiputyArray,
    "preferedMayor": preferedMayorArray,
    "preferedCouncillor": preferedCouncillorArray,
    "preferedDistrictDirector": preferedDistrictDirectorArray,
    "preferedDistrictCouncillor": preferedDistrictCouncillorArray,
    

}

return result
}




const MyCitizensDataController = async (id) => {

const total = await MyTotalCitizens(id)

const result = [total]
return result
}



module.exports = {
    MyCitizensDataController
}