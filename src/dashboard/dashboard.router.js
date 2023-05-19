const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')

require('../middlewares/auth.middleware')(passport)

//? esta ruta llama datos por usuario enviando el id
router.route('/:id')
.get(passport.authenticate('jwt', {session: false}), (req, res)=> {return res.status(200).json({msg:"Hola mundo!"})})

module.exports = router 