const router = require('express').Router()
const suffrageServices = require('./suffrage.services')
const passport = require('passport')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate, isDelegate } = require('../middlewares/role.middleware')


//get people who voted by college
router.get('/whovote', passport.authenticate('jwt', {session: false}), suffrageServices.getPeopleWhoVotedServices)

//get people who voted by college
router.post('/registervote', passport.authenticate('jwt', {session: false}), isDelegate, suffrageServices.createOrUpdateSuffrageServices)

//votacion grupal por posiciones y colegios
router.post('/registergrupalvote', passport.authenticate('jwt', {session: false}), isDelegate, suffrageServices.createOrUpdateSuffrageGrupalService)

module.exports = router
