const teamsController = require("./teams.controller")

//llamar a todos los partidos
const getAllTeams = (req, res) => {
teamsController
.getAllTeams()
.then((data) => {res.status(200).json(data)})
.catch((err) => {res.status(400).json({ message: err })});
}

//obtener los equipos a los que un usuario pertenece enviando el id del usuario
const getTeamsByUserService = (req, res) => {
    const user = req.params.id
    teamsController
    .getTeamsByUserController(user)
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err })});
}

//obtener los equipos a los que un usuario pertenece enviando el id del usuario
const getMyTeamsService = (req, res) => {
    const user = req.user.id
    teamsController
    .getTeamsByUserController(user)
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err })});
}

const createNewTeamServices = (req, res) => {
    const createdBy = req.user.id
    const {name, description} = req.body
    const members = []
    if(req.body.members){
        members.push(req.body.members)
    }

    if(!members.includes(createdBy)){
        members.push(createdBy)
    }

    console.log(members)
    const logo = req.file?.filename
    let teams
    if(name){
    teamsController
    .createNewTeam({name, logo, description}, createdBy)
    .then(data => {
        teams = data
    if(teams){
        teamsController.addMembersTeam(data.id, members, createdBy)
        .then((x) => {res.status(200).json({teams})})
    }
})
    .catch((err) => {res.status(400).json({ message: err })});
}else{
    res.status(400).json({ message: {
        error: "Es de mala suerte tener un equipo sin nombre"
    } })
}
}

//agregar miembro a un equipo 
const addTeamMemberService = (req, res)=> {
    const who = req.user.id
    const teamId = req.params.id
    const isAdmin = req.user.role>1?true:false
    const {members} = req.body

    teamsController
    .getOneTeamController(teamId)
    .then(
                (data) =>{
                if(data.createdBy==who || isAdmin){
                //agregar 1 o varios registros a la vez un equipo //teamId, members, teamLeder:uuid leader or false
                    teamsController.addMembersTeam(teamId, members, null)
                    .then((data) => {res.status(200).json(data)})
                    .catch((err) => {res.status(400).json({ message: err })});
                }
                else{
                    res.status(400).json({ message: "no es propietario del equipo contacte un administrador con permisos" })
                }
            
                }
                )
            .catch((err) => {res.status(400).json({ message: err })});
    
    //agregar 1 o varios registros a la vez un equipo //teamId, members, teamLeder:uuid leader or null or false
//    teamsController.addMembersTeam(teamId, members, createdBy)


}

//eliminar un equipo o Team
const deleteTeamService = (req, res) => {
    const who = req.user.id
    const id = req.params.id
    const isAdmin = req.user.role>1?true:false
    teamsController
    .getOneTeamController(id)
    .then(
        (data) =>{
        if(data.createdBy==who || isAdmin){
            teamsController.deleteTeamController(id)
            .then((data) => {res.status(200).json(data)})
            .catch((err) => {res.status(400).json(err)});
        }
        else{
            res.status(400).json({ message: "no es propietario del equipo contacte un administrador con permisos" })
        }
    })
}

//eliminar miembro de un equipo
const deleteTeamMemberService = (req, res)=> {
    const {teamId, memberId} = req.body

    teamsController
    .deleteTeamMemberController(teamId, memberId)
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err })});
}


const teamById = (req, res) => {

    const teamId = req.params.teamId
    teamsController
    .getOneTeamController(teamId)
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err })});
}



module.exports = {
    getAllTeams,
    createNewTeamServices,
    getTeamsByUserService,
    getMyTeamsService,
    addTeamMemberService,
    teamById,
    deleteTeamMemberService,
    deleteTeamService
}
