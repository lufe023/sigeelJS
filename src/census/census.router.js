const router = require('express').Router()
const censusServices = require('./census.services')
const passport = require('passport')

//acuerdate descomentar para agregar la autentificacion 
//router.get('/', passport.authenticate('jwt', {session: false}), censusServices.getAllCensus)
router.get('/', passport.authenticate('jwt', {session: false}), censusServices.getAllCensus)

router.post('/search',passport.authenticate('jwt', {session: false}), censusServices.findPeople)

module.exports = router

