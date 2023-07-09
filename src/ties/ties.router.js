const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
const tiesServices = require('./ties.services')
require('../middlewares/auth.middleware')(passport)

//ruta para crear vinculo 
router.post('/:acitizenid/:bcitizenid/:tiestype', passport.authenticate('jwt', {session:false}), tiesServices.newTiesServices)

//llamar a todos los tipos de enlace
router.get('/types', passport.authenticate('jwt', {session: false}), tiesServices.getAllTieTypesService)

//get people ties
router.get('/:citizenid', passport.authenticate('jwt', {session: false}), tiesServices.getPeoplesTiesByCitizenIdServices)

router.delete('/:id', passport.authenticate('jwt', {session: false}), tiesServices.deleteTiesService)


module.exports = router