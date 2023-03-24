const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
const pollsServices = require('./polls.services')

require('../middlewares/auth.middleware')(passport)

//? /api/v1/users/todo
router.route('/')
    .get(passport.authenticate('jwt', {session: false}), pollsServices.getAllPolls)

    .post(passport.authenticate('jwt', {session:false}), pollsServices.createNewCampain)

    module.exports = router 