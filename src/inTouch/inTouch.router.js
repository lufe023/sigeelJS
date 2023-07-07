const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
const inTouchServices = require('./inTouch.services')


require('../middlewares/auth.middleware')(passport)


//ruta para crear un registro dentro del modelo condition
router.post('/condition/:id', passport.authenticate('jwt', {session: false}), inTouchServices.createConditionServices)


router.patch('/condition/:id', passport.authenticate('jwt', {session: false}), inTouchServices.updateConditionService)

/*!# Rutas de Participacion */
//ruta para crear un registro dentro del modelo participacion
router.post('/participation/:id',passport.authenticate('jwt', {session: false}), inTouchServices.createParticipationServices)

router.delete('/participation/:activityid', passport.authenticate('jwt', {session: false}), inTouchServices.deleteParticipationServices)

/*!# Rutas de Beneficios*/
//ruta para crear un registro dentro del modelo Beneficio
router.post('/benefit/:id',passport.authenticate('jwt', {session: false}), inTouchServices.createBenefitServices)

router.delete('/benefit/:benefitid', passport.authenticate('jwt', {session: false}), inTouchServices.deleteBenefitServices)

/*!# Rutas de Trabajos*/
//ruta para crear un Trabajo
router.post('/job/:id',passport.authenticate('jwt', {session: false}), inTouchServices.createJobServices)

router.delete('/job/:jobid', passport.authenticate('jwt', {session: false}), inTouchServices.deleteJobServices)

module.exports = router