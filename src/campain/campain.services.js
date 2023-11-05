const campainControllers = require('./campain.controller')

//ver todas las campañas
const getAllCampains = (req, res) => {
    campainControllers
    .getAllCampains()
    .then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        res.status(400).json({ message: err.message });
    });
}


const createNewCampain = (req, res) => {
    const {
        name,
        details,
        municipio,
        provincia,
        startAt,
        finishAt,
        isActive
        } = req.body
        
        const createdBy = req.user.id

        if( name && details && startAt && finishAt && municipio)
        {

            campainControllers.createCampains({
                    name,
                    details,
                    municipio,
                    provincia,
                    createdBy,
                    startAt,
                    finishAt,
                    isActive
                    })
                .then((resultado) => {res.status(201).json({res: resultado})})
            
            .catch((err) => {res.status(400).json({Error: err.err});});
        
        } else {
        //? Error cuando no mandan todos los datos necesarios para crear un usuario
        res.status(400).json({
        message: "All fields must be completed",
        name,
        details,
        municipio,
        provincia,
        startAt,
        finishAt,
        isActive
        })
        }
}

const activeCampainServices = (req, res) => {

//ver todas las campañas
const id = req.query.id
const active = req.query.active

    campainControllers
    .activeCampainController(id, active)
    .then((data) => { res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err.message })});
}


//ver todas las campañas
const getCampainsByPlaceService = (req, res) => {

    const place = req.query.place
    const col = req.query.col

    campainControllers
    .getCampainsByPlaceController(place, col)
    .then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        res.status(400).json({ message: err.message });
    });
}


//ver campañas por colegio
const getCampainsByCollegeServices = (req, res) => {

    const collegeId = req.query.collegeId


    campainControllers
    .getCampainsByCollegeController(collegeId)
    .then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        res.status(400).json({ message: err.message });
    });
}

module.exports = {
    getAllCampains,
    createNewCampain,
    activeCampainServices,
    getCampainsByPlaceService,
    getCampainsByCollegeServices
}