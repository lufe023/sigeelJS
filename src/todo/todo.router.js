//? Tarea importante hacer un middleware que compruebe que esa tarea este o creada por el usuario que la accede o que este sea el responsable o que sea superadministrador para poder verla o editarla


const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
const todoServices = require('./todo.service')

require('../middlewares/auth.middleware')(passport)

//? /api/v1/users/todo
router.route('/')
    .get(
        passport.authenticate('jwt', {session: false}),
        todoServices.getAlltasks)

    .post(
            passport.authenticate('jwt', {session: false}),
            todoServices.createTask)

    module.exports = router