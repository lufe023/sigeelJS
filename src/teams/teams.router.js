const router = require('express').Router()
const passport = require('passport')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate } = require('../middlewares/role.middleware')
const multer = require('multer')
const teams = require('./teams.services')
const fs = require('fs-extra');

//tratando las imagenes 

// Directorio de destino para las imágenes
const uploadDirectory = './uploads/images/teams';

// Función para verificar si el directorio existe y crearlo si no
const createUploadDirectory = () => {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true }); // Crea el directorio de manera recursiva si no existe
  }
};

// Llama a la función para crear el directorio
createUploadDirectory();

// Configuración de multer para almacenar archivos en el directorio
const storage = multer.diskStorage({
    destination: (req, logo, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, logo, cb) => {
      const ext = logo.originalname.split('.').pop();
      cb(null, `${Date.now()}.${ext}`);
    },
  });

const upload = multer({storage})


require('../middlewares/auth.middleware')(passport)

router.get('/', passport.authenticate('jwt', {session: false}), teams.getAllTeams)

//obtener los equipos a los que pertenezco
router.get('/myteams', passport.authenticate('jwt', {session: false}), teams.getMyTeamsService)

//obtener los equipos a los que un usuario pertenece enviando el id del usuario
router.get('/:id', passport.authenticate('jwt', {session: false}), adminValidate, teams.getTeamsByUserService)

//obtener un equipo por id
router.get('/team/:teamId', passport.authenticate('jwt', {session: false}), teams.teamById)

//agregar miembros a un equipo deben ser numeros UUID separados por coma: UUID,UUID, UUID
router.post('/:id', passport.authenticate('jwt', {session: false}), teams.addTeamMemberService)

//crear un nuevo teams
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('logo'), teams.createNewTeamServices)

//eliminar un team
router.delete('/:id', passport.authenticate('jwt', {session: false}), teams.deleteTeamService)

//eliminar un miembro de un team
router.delete('/', passport.authenticate('jwt', {session: false}), teams.deleteTeamMemberService)

//actualizat un equipo
router.patch('/updateteam', passport.authenticate('jwt', {session: false}), upload.single('logo'), teams.updateTeamServices)

//actualizar los lideres de un equipo
router.patch('/setteamleader', passport.authenticate('jwt', {session: false}), teams.setTeamLeaderServices)

module.exports = router