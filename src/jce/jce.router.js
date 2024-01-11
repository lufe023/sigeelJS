const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const router = express.Router();
const passport = require('passport');
const { itSupportValidate, adminValidate, leaderValidate } = require('../middlewares/role.middleware');
const jceServices = require('./jce.services');

require('../middlewares/auth.middleware')(passport);

// Configuración de Multer para manejar las fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const absolutePath = path.join(process.env.RENDER_WORKING_DIR, 'uploads/images/citizens')

    cb(null, absolutePath);
  },
  filename: function (req, file, cb) {
    // Generar un UUID único para el nombre del archivo
    const uniqueFilename = `${uuid.v4()}.jpg`;

    // Crear un nombre de archivo usando el UUID y la extensión original del archivo
    const newFilename = `${uniqueFilename}`;

    // Asociar el UUID al citizenID en el cuerpo de la solicitud
    req.body.uniqueFilename = uniqueFilename;

    cb(null, newFilename);
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
  '/newcitizen',
  passport.authenticate('jwt', { session: false }),
  itSupportValidate,
  (req, res, next) => {
    // Encapsulamos el uso de Multer en una promesa
    new Promise((resolve, reject) => {
      upload.any('photos', 10)(req, res, (err) => {
        if (err) {
          console.error(err);
          reject('Error uploading files');
        } else {
          resolve();
        }
      });
    })
      .then(() => {
        // Continuar con el resto del código
        jceServices.newCitizenServices(req, res, next);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  }
);

module.exports = router 