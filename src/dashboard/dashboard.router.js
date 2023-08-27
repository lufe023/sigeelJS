const router = require('express').Router()
const passport = require('passport')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate } = require('../middlewares/role.middleware')
require('../middlewares/auth.middleware')(passport)

const dashboardServices = require('./dashboard.services')

//? esta ruta llama datos por usuario enviando el id del usuario y se seleccionará la o las campañas que esten activas
router.route('/')
.get(passport.authenticate('jwt', {session: false}), dashboardServices.MyCitizensDataServices)

//? esta ruta llama datos por usuario enviando el id del usuario mas el id de la campaña que se quiere ver
// router.route('/')
// .get(passport.authenticate('jwt', {session: false}), dashboardServices.MyCitizensDataServices)

module.exports = router 