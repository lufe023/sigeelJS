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