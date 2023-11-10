const router = require('express').Router()
const passport = require('passport')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate, isAdministrator } = require('../middlewares/role.middleware')
const userServices = require('./users.services')

require('../middlewares/auth.middleware')(passport)



//? rutas raiz
//esta ruta para ver todos los usuarios la protegemos primero con un token y luego con el nivel del rol del usuario
router.get('/', passport.authenticate('jwt', {session: false}), adminValidate, userServices.getAllUsers)

//? Ruta de informacion propia del usuario loggeado
router.route('/me')
    .get(
        passport.authenticate('jwt', {session: false}),
        userServices.getMyUser)
    .patch(
        passport.authenticate('jwt', {session: false}),
        userServices.patchMyUser
    )
    .delete(
        passport.authenticate('jwt', {session: false}),
        userServices.deleteMyUser
    )
//? /api/v1/users/passwordRequest
router.route('/changeUserRole')
.patch(passport.authenticate('jwt', {session: false}), isAdministrator , userServices.changeUserRoleService)

//? /api/v1/users/passwordRequest
router.route('/passwordRequest')
.post(userServices.requestForgotPassword)

router.route('/passwordRequest/:idRequest')
        .patch(userServices.changeForgotPassword)

//? /api/v1/users/:id
router.route('/:id')
    .get(
        passport.authenticate('jwt', {session: false}),
        //adminValidate,
        isAdministrator,
        userServices.getUserById)

    .patch(
        passport.authenticate('jwt', {session: false}),
        adminValidate,
        userServices.patchUser
    )
    .delete(
        passport.authenticate('jwt', {session: false}),
        adminValidate,
        userServices.deleteUser
    )

//busqueda simple en tiempo real de personas
router.post('/userSearch', userServices.simpleFindUser)



module.exports = router