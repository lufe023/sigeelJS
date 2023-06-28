const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
const gpsServices = require('./gps.services')
require('../middlewares/auth.middleware')(passport)

//llamar a todos los tipos de enlace
router.get('/:citizenID', passport.authenticate('jwt', {session: false}), gpsServices.getCitizensNearbyService)



module.exports = router