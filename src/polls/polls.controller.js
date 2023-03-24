const Polls = require('../models/poll.models')
const Campain = require('../models/campain.models')
const uuid = require('uuid')
const getAllPolls = async (id) => {
    const data = await Polls.findAll({
    })
    return data
}

const createCampain = async (data) => {
    const newCampain = await Campain.create({
        id: uuid.v4(),
        name: data.name,
        details: data.details,
        neighbourhood: data.neighbourhood,
        distrito_municipal: data.distrito_municipal,
        municipio: data.municipio,
        provincia: data.provincia,
        createdBy: data.createdBy
    })
    return newCampain
}

module.exports = {
    getAllPolls,
    createCampain
} 