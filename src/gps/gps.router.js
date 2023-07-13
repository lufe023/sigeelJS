const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
const gpsServices = require('./gps.services')
require('../middlewares/auth.middleware')(passport)

//llamar a las personas que se encuentren almenos a 500 metros del ciudadano
router.get('/nearby/:meters/:citizenID', passport.authenticate('jwt', {session: false}), gpsServices.getCitizensNearbyService)



module.exports = router