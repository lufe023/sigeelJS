const router = require('express').Router()
const passport = require('passport')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate } = require('../middlewares/role.middleware')
const multer = require('multer')
const teams = require('./teams.services')


//tratando las imagenes 

const storage = multer.diskStorage({
    destination: (req, logo, cb) =>{
        cb(null, './uploads/images/teams')
    },
    filename: (req, logo, cb) => {
        const ext = logo.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`)
    }
})

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


module.exports = router