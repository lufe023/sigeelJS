const ballotController = require('./ballots.controller');
const fs = require('fs').promises

const getAllBallots = (req, res) => {
        ballotController
        .getAllBallotsController()
        .then((data) => {
            res.status(200).json(data);
            })
        .catch((err) => {
            res.status(400).json({ message: err });
            });
}

const createNewCandidateServices = (req, res) => {
  
  const {
      name,
      party,
      partyAcronym,
      nomination,
      distritoMunicipal,
      picture,
      municipio,
      provincia
  } = req.body
const pictureName = req.file.filename

    if(name && party && partyAcronym && nomination)
    {
      ballotController.createNewCandidateController({
          name,
          party,
          partyAcronym,
          nomination,
          pictureName,
          distritoMunicipal,
          municipio,
          provincia
      })
      .then((data) => {
          res.status(201).json({data, pictureName});
      })
      .catch((err) => {
          res.status(400).json({
          Error: err,
          name,
          party,
          partyAcronym,
          nomination,
          picture,
          distritoMunicipal,
          municipio,
          provincia
        });
      });
  } else {
    //? Error cuando no mandan todos los datos necesarios para crear un usuario
    res.status(400).json({
      message: "All fields must be completed",
      fields: {
          name: "string",
          party: "string",
          nomination: "string",
          picture: "text but is optional"
      },
      name,
      party,
      partyAcronym,
      nomination,
      picture,
      distritoMunicipal,
      municipio,
      provincia
    })
  }
}

const getCandidateById = (req, res) => {
const candidateId = req.params.id
ballotController
.getCandidateById(candidateId)
.then((candidate) => {
  res.status(200).json(candidate);
})
  .catch((err) => {
    res.status(400).json(err)
  })
}

const deleteCandidateAndFiles = (req, res) =>{
  const candidateId = req.params.id
  ballotController.getCandidateById(candidateId)
  .then((candidate) => {

    ballotController.deleteCandidate(candidateId)
    .then()
    if(candidate.picture)
    {
    fs.unlink(`./uploads/images/candidates/${candidate.picture}`)
  .then(() => {
    console.log('File removed')
  }).catch(err => {
    console.error('Something wrong happened removing the file', err)
  })
}
    res.status(200).json({msg:'eliminado foto e informacion con exito'});
  })
  .catch((err) => {
    res.status(400).json(err)
  })
}
module.exports = {
    getAllBallots,
    createNewCandidateServices,
    getCandidateById,
    deleteCandidateAndFiles
}