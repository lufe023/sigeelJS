const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
const inTouchServices = require('./inTouch.services')


require('../middlewares/auth.middleware')(passport)


//ruta para crear un registro dentro del modelo condition
router.post('/condition/:id', passport.authenticate('jwt', {session: false}), inTouchServices.createConditionServices)

router.patch('/condition/:id', passport.authenticate('jwt', {session: false}), inTouchServices.updateConditionService)





module.exports = router