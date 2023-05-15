const router = require('express').Router()
const passport = require('passport')
const ballots = require('./ballots.services')
const adminValidate = require('../middlewares/role.middleware')
const uuid = require('uuid')
const multer = require('multer')

require('../middlewares/auth.middleware')(passport)

//tratando las imagenes 

    const storage = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, './uploads/images/candidates')
        },
        filename: (req, file, cb) => {
            const ext = file.originalname.split('.').pop()
            cb(null, `${Date.now()}.${ext}`)
        }
    })

    const upload = multer({storage})


//ver todo el padron
router.get('/', passport.authenticate('jwt', {session: false}), ballots.getAllBallots)


//ruta para crear un nuevo candidato
router.post('/', passport.authenticate('jwt', {session: false}), adminValidate, upload.single('file'), ballots.createNewCandidateServices)

//ruta para crear un nuevo partido
router.post('/party', passport.authenticate('jwt', {session: false}), adminValidate, ballots.createNewPartyServices)

//ruta para ver todos los partidos
router.get('/party', passport.authenticate('jwt', {session: false}), ballots.getAllPartysServices)

//ruta para eliminar un partido
router.delete('/party/:id', passport.authenticate('jwt', {session: false}), ballots.deletePartyService)

//ruta para llamar a un candidato por su id
router.get('/:id', passport.authenticate('jwt', {session: false}), ballots.getCandidateById)

//ruta para eliminar a un candidato de la base de datos y su foto del servidor
router.delete('/:id', passport.authenticate('jwt', {session: false}), ballots.deleteCandidateAndFiles)


module.exports = router