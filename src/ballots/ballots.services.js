const uuid = require('uuid')
const ballotController = require('./ballots.controller');
const multer = require('multer')

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

module.exports = {
    getAllBallots,
    createNewCandidateServices
}