const router = require('express').Router()
const passport = require('passport')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate } = require('../middlewares/role.middleware')
const todoServices = require('./todo.service')

require('../middlewares/auth.middleware')(passport)

//? /api/v1/users/todo
router.route('/')

    //ver todas las tareas del usuario logeado
    .get(
        passport.authenticate('jwt', {session: false}),
        todoServices.getAlltasks)

        //crear una nueva tarea
    .post(
            passport.authenticate('jwt', {session: false}),
            todoServices.createTask)

            //ver una tarea por id
router.route('/:id')  
    .get(
        passport.authenticate('jwt', {session: false}),
        todoServices.getTaskById)
//actualizar una tarea por id
    .patch(
        passport.authenticate('jwt', {session: false}),
        todoServices.patchTask)      

    module.exports = router 