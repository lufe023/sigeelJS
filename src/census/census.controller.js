const Census = require('../models/census.models')
const Districts = require('../models/district.models')
const Municipalities = require('../models/municipalities.models')
const Neighbourhood = require('../models/neighbourhood.models')
const Provinces = require('../models/provinces.models')
const Users = require('../models/users.models')
const Maps = require('../models/maps.models')

//const users = await User.findAll({ include: Map });

const getAllCensus = async () => {
    const data = await Census.findAll({
    

            include :[
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'provinces'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'municipalities'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'districts'
            },
            {
                model : Maps,
                attributes: ['id', 'name', 'parent'],
                as: 'neighbourhoods'
            }

        ]  
})
    return data
}


module.exports = {
    getAllCensus
}