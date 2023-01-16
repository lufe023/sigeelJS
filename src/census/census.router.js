const router = require('express').Router()
const censusServices = require('./census.services')
const passport = require('passport')

router.get('/', passport.authenticate('jwt', {session: false}), censusServices.getAllCensus)

module.exports = router

