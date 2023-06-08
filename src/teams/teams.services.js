const teamsController = require("./teams.controller")

//llamar a todos los partidos
const getAllTeams = (req, res) => {
teamsController
.getAllTeams()
.then((data) => {res.status(200).json(data)})
.catch((err) => {res.status(400).json({ message: err })});
}

const createNewTeamServices = (req, res) => {
    const leader = req.user.id
    const {name, members} = req.body
    const logo = req.file?.filename
    if(name){
    teamsController
    .createNewTeam({name, members, logo}, leader)
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err })});
}else{
    res.status(400).json({ message: {
        error: "Es de mala suerte tener un equipo sin nombre"
    } })
}
}

module.exports = {
    getAllTeams,
    createNewTeamServices
}
