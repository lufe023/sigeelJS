const Maps = require("../models/maps.models")


const getAllMaps = async () => {
    const data = await Maps.findAndCountAll({
})
    return data
}

const createNewMap = async (data) => {
    const newMap = await Maps.create({
        name: data.name,
        parent: data.parent,
        type: data.type, 
    })
    return newMap
}

module.exports = {
    getAllMaps,
    createNewMap
}