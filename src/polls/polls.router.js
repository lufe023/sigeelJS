const router = require('express').Router()
const passport = require('passport')
const adminValidate = require('../middlewares/role.middleware')
const pollsServices = require('./polls.services')

require('../middlewares/auth.middleware')(passport)

//? /api/v1/users/todo
    router.route('/')
    .get(passport.authenticate('jwt', {session: false}), pollsServices.getAllPolls)

    router.route('/:id')
    //obtener una encuesta de por id, esta encuesta responde a un elector y trae con ella todo lo relacionado a los candidatos que este puede seleccionar y sus respuesta de modo que se consiga no cometer errores al momento de seleccionar un candidato que no pertenezca a la demarcacion de ese lector
    .get(passport.authenticate('jwt', {session: false}), pollsServices.getPollById)
    
    //actualizacion de los datos de una ecuesta por id que pertenece a un elector, se ha decidido usar patch y no put, puesto que nos interesa poder cambiar de manera parcial los datos obtenidos del elector, esto responde a varias situaciones que se pueden presentar 
    .patch(passport.authenticate('jwt', {session: false}), pollsServices.updatePollService)
    
    //

    router.route('/campains')
    .get(passport.authenticate('jwt', {session: false}), pollsServices.getAllCampains)

    .post(passport.authenticate('jwt', {session:false}), adminValidate, pollsServices.createNewCampain)
    module.exports = router 