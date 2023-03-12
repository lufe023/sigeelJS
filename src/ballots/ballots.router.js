const router = require('express').Router()
const passport = require('passport')
const ballots = require('./ballots.services')
const adminValidate = require('../middlewares/role.middleware')

require('../middlewares/auth.middleware')(passport)

//ver todo el padron
router.get('/', passport.authenticate('jwt', {session: false}), ballots.getAllBallots)

router.post('/', passport.authenticate('jwt', {session: false}), adminValidate, ballots.createNewCandidateServices)

module.exports = router