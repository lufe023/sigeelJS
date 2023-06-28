const tiesController = require('./ties.controllers')

//servicio para crear nuevos lazos
const newTiesServices = (req, res) => {
    const aCitizenID = req.params.acitizenid
    const bCitizenID = req.params.bcitizenid
    const tiesType = req.params.tiestype

    tiesController
    .newTiesController(aCitizenID, bCitizenID, tiesType)
    .then((data) => {
    if(data[1]==true){
    {res.status(201).json(data)}
}else{
    res.status(409).json({msg: `Ya existe una relación entre ${aCitizenID} y ${bCitizenID}`, data})
}
})

    .catch((err) => {res.status(400).json({ message: err })});
}

//llamar todos los enlaces de una persona
const getPeoplesTiesByCitizenIdServices = (req, res) => {

    const citizenId = req.params.citizenid

    tiesController
    .getPeoplesTiesByCitizenIdController(citizenId)
    .then((data) => {
    res.status(200).json(data);
    })
    .catch((err) => {
    res.status(400).json({ err });
    });
}

const getAllTieTypesService = (req, res) => {

    tiesController
    .getAllTieTypesController()
    .then(data => {res.status(200).json({data, "h": "hola"})})
    .catch((err) => {res.status(400).json({ err })});
}

module.exports = {
    newTiesServices,
    getPeoplesTiesByCitizenIdServices,
    getAllTieTypesService
}