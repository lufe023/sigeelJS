const Ballot = require("../models/ballot.models")
const uuid = require('uuid')
const Maps = require("../models/maps.models")

//obteniendo todos los candidatos
const getAllBallotsController = async () => {
    const data = await Ballot.findAndCountAll({
        include :[
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'province'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'municipality'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'DistritoMunicipal'
            }]
})
    return data
}

//create new candidate
const createNewCandidateController = async (data) => {

    const newCandidate = await Ballot.create({
        candidateId: uuid.v4(),
        name: data.name,
        party: data.party,
        partyAcronym: data.partyAcronym, 
        nomination: data.nomination,
        picture: data.pictureName,
        distritoMunicipal: data.distritoMunicipal == 'null' ? null : data.distritoMunicipal,
        municipio: data.municipio,
        provincia: data.provincia
    })
    return newCandidate
}

//borrando un candidato de la ba de datos 
const getCandidateById = async(id) =>{
    const candidate = await Ballot.findOne({
        where: {
            candidate_id: id,
        }
    })
    return candidate
}

const deleteCandidate = async(id) =>{
    const data = await Ballot.destroy({
        where: {
            candidate_id: id,
        }
    })

    return data
}


module.exports = {
    getAllBallotsController,
    createNewCandidateController,
    getCandidateById,
    deleteCandidate
}