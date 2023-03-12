const Ballot = require("../models/ballot.models")
const uuid = require('uuid')

const getAllBallotsController = async () => {
    const data = await Ballot.findAndCountAll({

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
        picture: data.picture
    })
    return newCandidate
}

module.exports = {
    getAllBallotsController,
    createNewCandidateController
}