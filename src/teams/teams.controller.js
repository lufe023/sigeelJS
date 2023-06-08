const Teams = require("../models/teams.models")
const uuid = require('uuid')

//llamar todos los equipos
const getAllTeams = async () => {
const allTeams = await Teams.findAndCountAll()

return allTeams
} 


//create new candidate
const createNewTeam = async (data, leader) => {

    const newTeam = await Teams.create({
        id: uuid.v4(),
        name: data.name,
        leader: leader,
        logo: data.logo,
        members: data.members
    })
    return newTeam
}


module.exports = {
    getAllTeams,
    createNewTeam
}