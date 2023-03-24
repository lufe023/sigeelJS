const router = require('express').Router()
const passport = require('passport')
const maps = require('./maps.services')
const adminValidate = require('../middlewares/role.middleware')

require('../middlewares/auth.middleware')(passport)

//ver todo el mapa
router.get('/', passport.authenticate('jwt', {session: false}), maps.getAllMaps)

//crear un nuevo mapa
router.post('/', passport.authenticate('jwt', {session: false}), adminValidate, maps.createNewMap)

module.exports = router