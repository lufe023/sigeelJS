const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
require('../middlewares/auth.middleware')(passport)

const dashboardServices = require('./dashboard.services')
//? esta ruta llama datos por usuario enviando el id
router.route('/:id')
.get(passport.authenticate('jwt', {session: false}), dashboardServices.MyCitizensDataServices)

module.exports = router 