const ballotController = require("./ballots.controller");
const fs = require("fs").promises;

const getAllBallots = (req, res) => {
    ballotController
        .getAllBallotsController()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: err });
        });
};

//llamar a todos los partidos
const getAllPartysServices = (req, res) => {
    ballotController
        .getAllPartysController()
        .then((parties) => {
            res.status(200).json(parties);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
};

//Servicio de la creacion de un nuevo partido polito
const createNewPartyServices = (req, res) => {
    const { partyName, partyAcronyms, color } = req.body;

    if (partyName && partyAcronyms && color) {
        ballotController
            .createNewPartyController({ partyName, partyAcronyms, color })
            .then((data) => {
                res.status(201).json({ data });
            })
            .catch((err) => {
                res.status(400).json({ err });
            });
    } else {
        //? Error cuando no mandan todos los datos necesarios para crear un usuario
        res.status(400).json({
            message: "All fields must be completed",
            fields: {
                partyName: "string",
                partyAcronyms: "string",
                color: "string exadecimal prefered",
            },
        });
    }
};

//eliminar un partido
const deletePartyService = (req, res) => {
    const { id } = req.params;

    ballotController
        .deletePartyController(id)
        .then(res.status(200).json({ msg: `partido eliminado con exito` }))
        .catch((err) => {
            res.status(400).json(err);
        });
};

//servicio para crear un nuevo candidato en la base de datos y guardar la foto en servidor
const createNewCandidateServices = (req, res) => {
    const { name, party, nomination, distritoMunicipal, municipio, provincia } =
        req.body;
    const picture = req.file?.filename;

    if (name && party && nomination) {
        ballotController
            .createNewCandidateController({
                name,
                party,
                nomination,
                picture,
                distritoMunicipal,
                municipio,
                provincia,
            })
            .then((data) => {
                res.status(201).json({ data, picture });
            })
            .catch((err) => {
                res.status(400).json({
                    Error: err,
                    name,
                    party,
                    nomination,
                    distritoMunicipal,
                    municipio,
                    provincia,
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
                picture: "text but is optional",
            },
            name,
            party,
            partyAcronym,
            nomination,
            picture,
            distritoMunicipal,
            municipio,
            provincia,
        });
    }
};

//Servicio obtener un condidato por id
const getCandidateById = (req, res) => {
    const candidateId = req.params.id;
    ballotController
        .getCandidateById(candidateId)
        .then((candidate) => {
            res.status(200).json(candidate);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
};

//servicio para eliminar un candidato y su foto
const deleteCandidateAndFiles = (req, res) => {
    const candidateId = req.params.id;
    ballotController
        .getCandidateById(candidateId)
        .then((candidate) => {
            ballotController.deleteCandidate(candidateId).then();
            if (candidate.picture) {
                fs.unlink(`./uploads/images/candidates/${candidate.picture}`)
                    .then(() => {
                        console.log("File removed");
                    })
                    .catch((err) => {
                        console.error(
                            "Something wrong happened removing the file",
                            err
                        );
                    });
            }
            res.status(200).json({
                msg: "eliminado foto e informacion con exito",
            });
        })
        .catch((err) => {
            res.status(400).json(err);
        });
};
module.exports = {
    getAllBallots,
    createNewCandidateServices,
    getCandidateById,
    deleteCandidateAndFiles,
    createNewPartyServices,
    getAllPartysServices,
    deletePartyService,
};
