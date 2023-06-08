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

router.post('/', passport.authenticate('jwt', {session: false}), upload.single('logo'), teams.createNewTeamServices)

module.exports = router