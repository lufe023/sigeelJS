const Census = require('../models/census.models')
const Districts = require('../models/district.models')
const Municipalities = require('../models/municipalities.models')
const Neighbourhood = require('../models/neighbourhood.models')
const Provinces = require('../models/provinces.models')
const Users = require('../models/users.models')


//const users = await User.findAll({ include: Map });

const getAllCensus = async () => {
    const data = await Census.findAll({
    

            include :[
            {
                model : Provinces,
                attributes: ['name']},
            {
                model: Municipalities,
                attributes: ['name', 'parent']},
            {
                model: Districts,
                attributes: ['name', 'parent'],
                required: false},
            {
                model: Neighbourhood,
                attributes: ['name', 'parent'],
                required: false
            },
            {
                model: Users,
                attributes: ['email'],
                required: false
            }

        ]  
})
    return data
}


module.exports = {
    getAllCensus
}