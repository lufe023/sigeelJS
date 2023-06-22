const inTouchController = require('./inTouch.controller')

const createConditionServices = (req, res) => {
    
    //extracion y declaracion de las variables y los datos a enviar
    const citizenId = req.params.id
    const {
        conditionDetails,
        dyslexia, 
        visual,
        auditory,
        motor,
        cognitive,
        outside
        } = req.body

    if(conditionDetails && citizenId){
    inTouchController
    .createConditionController(
        citizenId,
        {conditionDetails,
        dyslexia, 
        visual,
        auditory,
        motor,
        cognitive,
        outside} )
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ message: err })})
}
else{
    res.status(400).json({
    message: "debe llenar los campos citizenId: que se toma del parametro de la url y conditionDetails que se envia en el body" })
}
    // .then((data) => {res.status(200).json(data)})
    // .catch((err) => {res.status(400).json({ message: err })})
}


const updateConditionService = (req, res) => {

     //extracion y declaracion de las variables y los datos a enviar
    const citizenId = req.params.id

    const {
    conditionDetails,
    dyslexia, 
    visual,
    auditory,
    motor,
    cognitive,
    outside
    } = req.body
    if(conditionDetails && citizenId){
        inTouchController
        inTouchController
        .updateConditionController(
            citizenId,
            {conditionDetails,
            dyslexia, 
            visual,
            auditory,
            motor,
            cognitive,
            outside} )
        .then((data) => {res.status(200).json(data)})
        .catch((err) => {res.status(400).json({ message: err })})
    }
    else{
        res.status(400).json({
        message: "debe llenar los campos citizenId: que se toma del parametro de la url y conditionDetails que se envia en el body" })
    }
}


module.exports = {
    createConditionServices,
    updateConditionService
}