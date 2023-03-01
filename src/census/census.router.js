const router = require('express').Router()
const censusServices = require('./census.services')
const passport = require('passport')

//acuerdate descomentar para agregar la autentificacion 
//router.get('/', passport.authenticate('jwt', {session: false}), censusServices.getAllCensus)

//ver todo el padron
router.get('/', passport.authenticate('jwt', {session: false}), censusServices.getAllCensus)

//busqueda en tiempo real de personas
router.post('/search',passport.authenticate('jwt', {session: false}), censusServices.findPeople)

//agegar personas a mi padron personal
router.post('/addpeople', passport.authenticate('jwt', {session: false}), censusServices.addPeople)

//ver mi padron personal
router.get('/mypeople', passport.authenticate('jwt', {session: false}), censusServices.getMyPeople)




module.exports = router

