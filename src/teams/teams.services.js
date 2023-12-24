const teamsController = require("./teams.controller")
const imagenController = require('../images/images.controller')
const {isAdministratorBoolean} = require('../middlewares/role.middleware')

//llamar a todos los partidos
const getAllTeams = (req, res) => {
    const role = req.user.role
teamsController
.getAllTeams(role)
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
    const {name, description, whatsapp} = req.body
    const logo = req.file?.filename
    const members = []
    if(req.body.members){
        members.push(req.body.members)
    }

    if(!members.includes(createdBy)){
        members.push(createdBy)
    }

    let teams
    if(name){
    teamsController
    .createNewTeam({name, logo, description, whatsapp}, createdBy)
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
    const isAdmin = req.user.role>=3
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
    const isAdmin = req.user.role>=3
    teamsController
    .getOneTeamController(id)
    .then(
        (data) =>{
        if(data?.createdBy==who || isAdmin){
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
    
    if(teamId, memberId){
    teamsController
    .deleteTeamMemberController(teamId, memberId)
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err })});
}else{
    res.status(400).json({ message: "debe enviar teamId:UUID, y memberId: UUID",teamId, memberId})
}
}


const teamById = (req, res) => {

    const teamId = req.params.teamId
    teamsController
    .getOneTeamController(teamId)
    .then((data) => 
    {
        if(data!=null){
        res.status(200).json(data)
    }else{
        res.status(400).json({msg: null})
    }
    })
    .catch((err) => {res.status(400).json({ message: err })});
}

// update a team
const updateTeamServices = async (req, res) => {
    const { teamId, name, teamLeader, description, whatsapp } = req.body;
    const logo = req.file?.filename;
    const createdBy = teamLeader;

    const who = req.user.id;
    const isAdmin = await isAdministratorBoolean(req.user.id)

    //nota para la deuda tecnica en esta funcion se usa el middleware isAministrator de forma correcta
    // se debe cambiar en las demas funciones porque consulta directamente en la DB y no toma valores del token
    try {
        if (!teamId) {
            throw new Error("Se necesita de forma obligatoria un teamId");
        }

        const team = await teamsController.getOneTeamController(teamId);
        if (team.createdBy == who || isAdmin) {

            const updatedData = {
                logo,
                name,
                description,
                whatsapp,
                createdBy
            };
    
            const [updateResult] = await teamsController.updateTeamController(updatedData, teamId);
    
            // Verifica si la actualización fue exitosa y si hay un nuevo logo
            if (logo) {
                // Llamada al controlador para borrar la imagen antigua
                await imagenController.deleteImageController("teams", team.logo);
            }
    
            res.status(200).json({ data: updateResult });
        }else{
            throw new Error("Usted no es team Leader del equipo o no tiene permisos de administrador");
        
    }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//agregar o quitar otros teamLeaders al equipo
const setTeamLeaderServices = async (req, res) => {
    const {memberId, teamId, value } = req.body;
    const requester = req.user.id; // Supongo que "who" debería ser "createdBy"
    const isAdmin = await isAdministratorBoolean(req.user.id)

try {
        if (!teamId) {
            throw new Error("Se necesita de forma obligatoria un teamId");
        }

        const team = await teamsController.getOneTeamController(teamId);
        const isTeamLeader = team.members.some(member => member.teamLeader && member.memberId === requester);

        if (isAdmin || isTeamLeader) {
            
        const updateResult = await teamsController.setTeamLeaderController(memberId, teamId, value);

            // Puedes agregar la lógica para manejar el logo aquí, si es necesario

            res.status(200).json({ data: updateResult });
        } else {
            res.status(400).json({ message:"Usted no es el líder del equipo, no tiene permisos de administrador"});
        }
    } catch (err) {
        console.error('Error en setTeamLeaderServices:', err);
        res.status(400).json({ message: err });
    }
};


    // teamsController
    // .deleteTeamMemberController(teamId, memberId)
    // .then((data) => {res.status(200).json(data)})
    // .catch((err) => {res.status(400).json({ message: err })});




module.exports = {
    getAllTeams,
    createNewTeamServices,
    getTeamsByUserService,
    getMyTeamsService,
    addTeamMemberService,
    teamById,
    deleteTeamMemberService,
    deleteTeamService,
    updateTeamServices,
    setTeamLeaderServices
}
