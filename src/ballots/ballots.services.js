const ballotController = require('./ballots.controller');

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
        picture,
        distritoMunicipal,
        municipio,
        provincia
    } = req.body


      if(name && party && partyAcronym && nomination)
      {
        ballotController.createNewCandidateController({
            name,
            party,
            partyAcronym,
            nomination,
            picture,
            distritoMunicipal,
            municipio,
            provincia
        })
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(400).json({
            Error: err.message
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
      })
    }
  }

module.exports = {
    getAllBallots,
    createNewCandidateServices
}