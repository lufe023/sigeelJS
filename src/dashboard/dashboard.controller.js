const Ballot = require('../models/ballot.models')
const Benefit = require('../models/benefit.models')
const Census = require('../models/census.models')
const Gps = require('../models/gps.models')
const Job = require('../models/job.models')
const Participation = require('../models/participation.models')
const Parties = require('../models/parties.models')
const Poll = require('../models/poll.models')

const MyTotalCitizens = async (userId, campainId)=> {
    const citizens =  await Census.findAndCountAll({
        where: {
            leader:userId
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
                    as: "Encuestas",
                    where:
                    campainId? {campain:campainId} : {active: true},
                    include:[
                        {
                            model: Parties,
                            as: "preferedPartyDetails"
                        },
                        {
                            model: Ballot,
                            as: "preferedPresidentDetails",
                            include:['partyDetails'],
                            attributes:['candidateId','name', 'nomination']
                        },
                        {
                            model: Ballot,
                            as: "preferedSenatorDetails",
                            include:['partyDetails'],
                            attributes:['candidateId','name', 'nomination']
                        },
                        {
                            model: Ballot,
                            as: "preferedDiputyDetails",
                            include:['partyDetails'],
                            attributes:['candidateId','name', 'nomination']
                        },
                        {
                            model: Ballot,
                            as: "preferedMayorDetails",
                            include:['partyDetails'],
                            attributes:['candidateId','name', 'nomination']
                        },
                        {
                            model: Ballot,
                            as: "preferedCouncillorDetails",
                            include:['partyDetails'],
                            attributes:['candidateId','name', 'nomination']
                        },
                        {
                            model: Ballot,
                            as: "preferedDistrictDirectorDetails",
                            include:['partyDetails'],
                            attributes:['candidateId','name', 'nomination']
                        },
                        {
                            model: Ballot,
                            as: "preferedDistrictCouncilorDetails",
                            include:['partyDetails'],
                            attributes:['candidateId','name', 'nomination']
                        },
                    ]
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

    let preferedParty =  encuestas.map(x => x[0]).map(x =>x.preferedPartyDetails[0])
    let lookingParty
    
    for (let i=0; i < preferedParty.length; i++){ 
        if(preferedParty[i]){
            lookingParty = preferedPartyArray.findIndex(arr => arr.id ===preferedParty[i].id)
            if(lookingParty ==-1 ){
                preferedPartyArray.push({id: preferedParty[i].id, partyName: preferedParty[i].partyName, partyAcronyms: preferedParty[i].partyAcronyms, color: preferedParty[i].color, total: 1})
            }else{
                preferedPartyArray[lookingParty].total = preferedPartyArray[lookingParty].total+1
            }
        }
    }
//Fin sacando los votos de los partidos preferidos


//!? #inicio Sacando los votos de los presidentes preferidos
const preferedPresidentArray = []

let preferedPresident =  encuestas.map(x => x[0]).map(x=>x.preferedPresidentDetails[0])
let lookingPresident

for (let i=0; i < preferedPresident.length; i++){ 
    if(preferedPresident[i]){
        lookingPresident = preferedPresidentArray.findIndex(arr => arr.president === preferedPresident[i].candidateId)
        if(lookingPresident ==-1 ){
            preferedPresidentArray.push({
                president: preferedPresident[i].candidateId,
                presidentName: preferedPresident[i].name,
                partyDetails: preferedPresident[i].partyDetails, 
                total: 1
            })
        }else{
            preferedPresidentArray[lookingPresident].total = preferedPresidentArray[lookingPresident].total+1
        }
    }
}
//Fin sacando los votos de los presidentes preferidos


//!? #inicio Sacando los votos de los Senadores preferidos
const preferedSenatorArray = []

let preferedSenator =  encuestas.map(x => x[0]).map(x=>x.preferedSenatorDetails[0])
let lookingSenator

for (let i=0; i < preferedSenator.length; i++){ 
    if(preferedSenator[i]){
        lookingSenator = preferedSenatorArray.findIndex(arr => arr.senator === preferedSenator[i].candidateId)
        if(lookingSenator ==-1 ){
            preferedSenatorArray.push({
                senator: preferedSenator[i].candidateId,
                senatorName: preferedSenator[i].name,
                partyDetails: preferedSenator[i].partyDetails, 
                total: 1
            })
        }else{
            preferedSenatorArray[lookingSenator].total = preferedSenatorArray[lookingSenator].total+1
        }
    }
}
//Fin sacando los votos de los Senadores preferidos

//!? #inicio Sacando los votos de los Diputados preferidos
const preferedDiputyArray = []

let preferedDiputy =  encuestas.map(x => x[0]).map(x=>x.preferedDiputyDetails[0])
let lookingDiputy

for (let i=0; i < preferedDiputy.length; i++){ 
    if(preferedDiputy[i]){
        lookingDiputy = preferedDiputyArray.findIndex(arr => arr.diputy === preferedDiputy[i].candidateId)
        if(lookingDiputy ==-1 ){
            preferedDiputyArray.push({
                diputy: preferedDiputy[i].candidateId,
                diputyName: preferedDiputy[i].name,
                partyDetails: preferedDiputy[i].partyDetails, 
                total: 1
            })
        }else{
            preferedDiputyArray[lookingDiputy].total = preferedDiputyArray[lookingDiputy].total+1
        }
    }
}
//Fin sacando los votos de los Diputados preferidos

//!? #inicio Sacando los votos de los Alcalde preferidos
const preferedMayorArray = []

let preferedMayor =  encuestas.map(x => x[0]).map(x=>x.preferedMayorDetails[0])
let lookingMayor

for (let i=0; i < preferedMayor.length; i++){ 
    if(preferedMayor[i]){
        lookingMayor = preferedMayorArray.findIndex(arr => arr.mayor === preferedMayor[i].candidateId)
        if(lookingMayor ==-1 ){
            preferedMayorArray.push({
                mayor: preferedMayor[i].candidateId,
                mayorName: preferedMayor[i].name,
                partyDetails: preferedMayor[i].partyDetails, 
                total: 1
            })
        }else{
            preferedMayorArray[lookingMayor].total = preferedMayorArray[lookingMayor].total+1
        }
    }
}
//Fin sacando los votos de los Alcalde preferidos


//!? #inicio Sacando los votos de los Regidores preferidos
const preferedCouncillorArray = []

let preferedCouncillor =  encuestas.map(x => x[0]).map(x=>x.preferedCouncillorDetails[0])
let lookingCouncillor

for (let i=0; i < preferedCouncillor.length; i++){ 
    if(preferedCouncillor[i]){
        lookingCouncillor = preferedCouncillorArray.findIndex(arr => arr.councillor === preferedCouncillor[i].candidateId)
        if(lookingCouncillor ==-1 ){
            preferedCouncillorArray.push({
                councillor: preferedCouncillor[i].candidateId,
                councillorName: preferedCouncillor[i].name,
                partyDetails: preferedCouncillor[i].partyDetails, 
                total: 1
            })
        }else{
            preferedCouncillorArray[lookingCouncillor].total = preferedCouncillorArray[lookingCouncillor].total+1
        }
    }
}
//Fin sacando los votos de los Regidores preferidos

//!? #inicio Sacando los votos de los Director distritales preferidos
const preferedDistrictDirectorArray = []

let preferedDistrictDirector =  encuestas.map(x => x[0]).map(x=>x.preferedDistrictDirectorDetails[0])
let lookingDistrictDirector

for (let i=0; i < preferedDistrictDirector.length; i++){ 
    if(preferedDistrictDirector[i]){
        lookingDistrictDirector = preferedDistrictDirectorArray.findIndex(arr => arr.districtDirector === preferedDistrictDirector[i].candidateId)
        if(lookingDistrictDirector ==-1 ){
            preferedDistrictDirectorArray.push({
                districtDirector: preferedDistrictDirector[i].candidateId,
                districtDirectorName: preferedDistrictDirector[i].name,
                partyDetails: preferedDistrictDirector[i].partyDetails, 
                total: 1
            })
        }else{
            preferedDistrictDirectorArray[lookingDistrictDirector].total = preferedDistrictDirectorArray[lookingDistrictDirector].total+1
        }
    }
}
//Fin sacando los votos de los Director distritales preferidos

//!? #inicio Sacando los votos de los Director distritales preferidos
const preferedDistrictCouncillorArray = []

let preferedDistrictCouncillor =  encuestas.map(x => x[0]).map(x=>x.preferedDistrictCouncilorDetails[0])
let lookingDistrictCouncillor

for (let i=0; i < preferedDistrictCouncillor.length; i++){ 
    if(preferedDistrictCouncillor[i]){
        lookingDistrictCouncillor = preferedDistrictCouncillorArray.findIndex(arr => arr.districtCouncillor === preferedDistrictCouncillor[i].candidateId)
        if(lookingDistrictCouncillor ==-1 ){
            preferedDistrictCouncillorArray.push({
                districtCouncillor: preferedDistrictCouncillor[i].candidateId,
                districtCouncillorName: preferedDistrictCouncillor[i].name,
                partyDetails: preferedDistrictCouncillor[i].partyDetails, 
                total: 1
            })
        }else{
            preferedDistrictCouncillorArray[lookingDistrictCouncillor].total = preferedDistrictCouncillorArray[lookingDistrictCouncillor].total+1
        }
    }
}
//Fin sacando los votos de los Vo distritales preferidos


const result = {
    "ciudadanos": citizens,
    "Activities": activities,
    "Beneficios": beneficios,
    "Encuestas":{
        "total":encuestas.length,
        "Completas":completas,
        "Incompletas": incompletas,
        "percent_complete": Math.round(completas/encuestas.length*100),
        "percent_incomplete": Math.round(incompletas/encuestas.length*100)
    },
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
const partiesList = async () => {
    const parties = await Parties.findAndCountAll() 
    
    return parties
}

const MyCitizensDataController = async (userId, campainId) => {

const total = await MyTotalCitizens(userId, campainId)

const result = [total]
return result
}



module.exports = {
    MyCitizensDataController,
    partiesList
}