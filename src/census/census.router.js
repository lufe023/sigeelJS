const router = require('express').Router()
const censusServices = require('./census.services')
const passport = require('passport')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate } = require('../middlewares/role.middleware')

//acuerdate descomentar para agregar la autentificacion 
//router.get('/', passport.authenticate('jwt', {session: false}), censusServices.getAllCensus)

//ver todo el padron
router.get('/', passport.authenticate('jwt', {session: false}), censusServices.getAllCensus)

//ver mi padron personal
router.get('/mypeople', passport.authenticate('jwt', {session: false}), censusServices.getMyPeople)

//ver el padron de alguien mas si eres administrador
router.post('/peoplebyuser', passport.authenticate('jwt', {session: false}), adminValidate, censusServices.getPeopleByUser)

//busqueda en tiempo real de personas
router.post('/search',passport.authenticate('jwt', {session: false}), censusServices.findPeople)

//busqueda simple en tiempo real de personas
router.post('/simplesearch', censusServices.simpleFindPeople)

//agegar personas a mi padron personal
router.post('/addpeople', passport.authenticate('jwt', {session: false}), censusServices.addPeople)

//eliminar una persona de tu padrón personal
router.post('/removepeople', passport.authenticate('jwt', {session: false}), censusServices.removePeople)


//get One People
router.get('/:id', passport.authenticate('jwt', {session: false}), censusServices.getOnePeople)


module.exports = router

