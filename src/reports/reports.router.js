const router = require('express').Router()
const passport = require('passport')
const reportsServices = require('./reports.services')
const {leaderValidate, adminValidate, itSupportValidate, superAdminValidate } = require('../middlewares/role.middleware')

require('../middlewares/auth.middleware')(passport)



//traer un reporte a partir del id de una campaña
router.get('/', passport.authenticate('jwt', {session: false}), reportsServices.getCampainReport)

//traer un reporte a partir del id de una campaña
router.get('/parties', passport.authenticate('jwt', {session: false}), reportsServices.getPartyReport)

//reporte por colegio electoral
router.get('/collegeReport', passport.authenticate('jwt', {session: false}), reportsServices.getPartyCollegeReportService)

//traer un reporte a partir del id de una campaña para el presidente preferido
router.get('/president', passport.authenticate('jwt', {session: false}), reportsServices.getPreferedPresidentReportByPlaceService)


//boca de urna
router.get('/urna', passport.authenticate('jwt', {session: false}), reportsServices.bocaUrnaService)

router.get('/cobertura', passport.authenticate('jwt', {session: false}), reportsServices.coberturaService)

module.exports = router