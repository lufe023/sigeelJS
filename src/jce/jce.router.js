const express = require('express');
const multer = require('multer');

const router = express.Router();
const passport = require('passport');
const { itSupportValidate, adminValidate, leaderValidate } = require('../middlewares/role.middleware');
const jceServices = require('./jce.services');

require('../middlewares/auth.middleware')(passport);

// Configuración de Multer para manejar las fotos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/images/citizens/testing');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024 * 1024, // 10 MB (ajusta el tamaño según tus necesidades)
    },
  });

//rutas para los recintos ##############################################
//ver todos los recintos
router.get('/precints', passport.authenticate('jwt', {session: false}), jceServices.getAllPrecintService)

//conseguir la consistencia de los datos de cada colegio 
router.get('/dataConsistency', passport.authenticate('jwt', {session: false}), leaderValidate, jceServices.getDataConsistencyService)

//crear un nuevo recinto
router.post('/precints', passport.authenticate('jwt', {session: false}), adminValidate, jceServices.createPrecintServices)

//rutas para los Colegios ##############################################

//ver todos los recintos
router.get('/colleges', passport.authenticate('jwt', {session: false}), jceServices.getAllCollegeService)

//crear un nuevo recinto
router.post('/colleges', passport.authenticate('jwt', {session: false}), adminValidate, jceServices.createCollegeServices)

//crear ciudadanos de forma grupal
router.post(
    '/citizens',
    passport.authenticate('jwt', { session: false }),
    itSupportValidate,
    upload.any('photos', 10), // Cambia upload.array('photos', 10) por upload.any()
    jceServices.grupalCitizensServices
  );

module.exports = router 