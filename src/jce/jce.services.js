const jceController = require('./jce.controller')

//? Star Precints area ################################################# Star Precints area ###################################################

const createPrecintServices = (req, res) => {
    const {
        precintNumber,
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

        if(precintNumber && recintoNombre && provincia && municipio){
            jceController
            .createPrecintController({
                precintNumber,
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
        collegeNumber,
        precinct,
        electLocal,
        electExterior,
        meta} = req.body

        if(collegeNumber && precinct){
            jceController
            .createCollegeController({
                collegeNumber,
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
    const { citizens } = req.body;
    const uniqueFilenames = req.files.map(file => file.filename);

    // Llamar al controlador con el array actualizado
    jceController
        .grupalCitizensController(citizens, uniqueFilenames)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json({ err }));
};

const newCitizenServices = (req, res) => {
    const { citizen } = req.body;
    const filename = req.body.uniqueFilename;

    if(citizen.province && citizen.municipality && citizen.college && citizen.firstName &&  citizen.lastName && citizen.citizenID){
    jceController
        .newCitizenController(citizen, filename)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json({
        err
        }));
    }else{
        res.status(400).json({
            msg: "debe enviar los campos province, municipality, college, firstName, lastName y citizenID"
        })
    }
};

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
    getDataConsistencyService,
    newCitizenServices
}