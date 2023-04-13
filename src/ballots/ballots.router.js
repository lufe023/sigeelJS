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

//rutas
let otra = "hola"
//ver todo el padron
router.get('/', passport.authenticate('jwt', {session: false}), ballots.getAllBallots)

router.post('/', passport.authenticate('jwt', {session: false}), adminValidate, upload.single('file'), ballots.createNewCandidateServices)

router.get('/:id', passport.authenticate('jwt', {session: false}), ballots.getCandidateById)

router.delete('/:id', passport.authenticate('jwt', {session: false}), ballots.deleteCandidateAndFiles)
module.exports = router