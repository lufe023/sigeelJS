const Census = require('../models/census.models')

const getAllCensus = async () => {
    const data = await Census.findAll()
    return data
}

module.exports = {
    getAllCensus
}