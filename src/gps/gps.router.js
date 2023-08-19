const router = require('express').Router()
const passport = require('passport')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate } = require('../middlewares/role.middleware')
const gpsServices = require('./gps.services')
require('../middlewares/auth.middleware')(passport)

//llamar a las personas que se encuentren almenos a 500 metros del ciudadano
router.get('/nearby/:meters/:citizenID', passport.authenticate('jwt', {session: false}), gpsServices.getCitizensNearbyService)

//nuevo gps
router.post('/:citizenID', passport.authenticate('jwt', {session:false}),gpsServices.newGPSLocationService)

module.exports = router