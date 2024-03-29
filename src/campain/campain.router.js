const router = require('express').Router()
const passport = require('passport')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate } = require('../middlewares/role.middleware')
const campainServices = require('./campain.services')

require('../middlewares/auth.middleware')(passport)


router.route('/')
.get(passport.authenticate('jwt', {session: false}), campainServices.getAllCampains)

router.route('/byplace')
.get(passport.authenticate('jwt', {session: false}), campainServices.getCampainsByPlaceService)


router.route('/college')
.get(passport.authenticate('jwt', {session: false}), campainServices.getCampainsByCollegeServices)

router.route('/')
.post(passport.authenticate('jwt', {session:false}), adminValidate, campainServices.createNewCampain)

router.route('/')
.patch(passport.authenticate('jwt', {session:false}), adminValidate, campainServices.activeCampainServices)

module.exports = router 