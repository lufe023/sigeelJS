const Teams = require("../models/teams.models")
const uuid = require('uuid')
const { Op } = require('sequelize');

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


//obtener los equipos a los que un usuario pertenece enviando el id del usuario
const getTeamsByUserController = async (memberId) => {

    const userTeams = await Teams.findAndCountAll({
        where: {
            members: {
                [Op.like]: `%${memberId}%`,
            }
        }
    })

    return userTeams
}

module.exports = {
    getAllTeams,
    createNewTeam,
    getTeamsByUserController
}