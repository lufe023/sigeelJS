const jceController = require('./jce.controller')

//? Star Precints area ################################################# Star Precints area ###################################################

const createPrecintServices = (req, res) => {
    const {
        id,
        recintoNombre,
        direccionRecinto,
        latitud,
        longitud,
        electLocal,
        electExterior,
        provincia,
        municipio,
        distrito,
        circunscripcion} = req.body

        if(id && recintoNombre && provincia && municipio){
            jceController
            .createPrecintController({
                id,
                recintoNombre,
                direccionRecinto,
                latitud,
                longitud,
                electLocal,
                electExterior,
                provincia,
                municipio,
                distrito,
                circunscripcion})
                .then((data) => {res.status(200).json(data)})
                .catch((err) => {res.status(400).json({ message: err })})
        }else{
            res.status(400).json({ message: 'debe llenar por lo menos los campos id && recintoNombre && provincia && municipio' })
        }
}

const getAllPrecintService = (req, res) => {

    jceController
    .getAllPrecintController()
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err })})
}

//? Star College area ################################################# Star College area ###################################################
const createCollegeServices = (req, res) => {
    const {
        id,
        precinct,
        electLocal,
        electExterior,
        meta} = req.body

        if(id && precinct){
            jceController
            .createCollegeController({
                id,
                precinct,
                electLocal,
                electExterior,
                meta})
            .then((data) => {res.status(200).json(data)})
            .catch((err) => {res.status(400).json({ message: err })})
        }else{
            res.status(400).json({ message: 'debe llenar por lo menos los campos id && precinct' })
        }
}

const getAllCollegeService = (req, res) => {

    jceController
    .getAllCollegeController()
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err })})
}

//? start registrando Ciudadanos ################################################# registrando Ciudadanos ###################################################

const grupalCitizensServices = (req, res) => {

    const {citizens} = req.body
   
    jceController
    .grupalCitizensController(citizens)
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err,})})
}

const getDataConsistencyService = (req, res) => {
    jceController
    .getDataConsistencyController()
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err})})
}


module.exports = {
    createPrecintServices,
    getAllPrecintService,
    getAllCollegeService,
    createCollegeServices,
    grupalCitizensServices,
    getDataConsistencyService
}