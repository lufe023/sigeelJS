const suffrageControlles = require('./suffrage.controller')

const getPeopleWhoVotedServices = (req, res) => {

    const {collegeId} = req.query

if(collegeId){

    //donde inicia 
    const offset = Number(req.query.offset) || 0

    //capacidad maxima
    const limit =  Number(req.query.limit) || 10

    suffrageControlles
    .getPeopleWhoVotedController(collegeId, offset, limit)
    .then((result) => {res.status(200).json(result)})
    .catch((err) => {res.status(400).json(err)});

}else{
    res.status(400).json({message:"debe enviar un valor para collegeId"});
}
}

const createOrUpdateSuffrageServices = (req, res) => {
    const registerBy = req.user.id
    const {citizenID, suffrageValue} = req.body

    if(citizenID, suffrageValue, registerBy)
        {
        suffrageControlles
        .createOrUpdateSuffrageController(citizenID, suffrageValue, registerBy)
        .then((result) => {res.status(200).json(result)})
        .catch((err) => {res.status(400).json(err)});
        }else{
            res.status(400).json({message:"debe enviar todos los campos requeridos: citizenID, suffrageValue"})
        }
}

const createOrUpdateSuffrageGrupalService = (req, res) => {
    const registerBy = req.user.id
    const {positions, collegeId, suffrageValue} = req.body

    if(positions, collegeId, suffrageValue, registerBy)
        {
        suffrageControlles
        .createOrUpdateSuffrageGrupalController(positions, collegeId, suffrageValue, registerBy)//positions, collegeId, suffrageValue, registerBy
        .then((result) => {res.status(200).json(result)})
        .catch((err) => {res.status(400).json(err)});
        }else{
            res.status(400).json({message:"debe enviar todos los campos requeridos: citizenID, suffrageValue"})
        }
}


module.exports = {
    getPeopleWhoVotedServices,
    createOrUpdateSuffrageServices,
    createOrUpdateSuffrageGrupalService
}