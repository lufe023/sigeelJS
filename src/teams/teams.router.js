const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
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

router.post('/', passport.authenticate('jwt', {session: false}), upload.single('logo'), teams.createNewTeamServices)

module.exports = router