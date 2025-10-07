const pollsControllers = require("./polls.controller");

const getAllPolls = (req, res) => {
    pollsControllers
        .getAllPolls()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

//una encuesta por id
const getPollById = (req, res) => {
    const { id } = req.params;
    pollsControllers
        .getPollById(id)

        .then((poll) => {
            res.status(201).json({ poll });
        })

        .catch((err) => {
            console.log(err);
            res.status(400).json({ Error: err.err });
        });
};

//actualizacion de las encuestas
const updatePollService = (req, res) => {
    const pollId = req.params.id;

    const updatedBy = req.user.id;

    const {
        preferedParty,
        electorType,
        president,
        senator,
        diputy,
        mayor,
        councillor,
        districtDirector,
        districtCouncilor,
        alreadyVoted,
    } = req.body;

    pollsControllers
        .updatePollController(pollId, {
            preferedParty,
            electorType,
            president,
            senator,
            diputy,
            mayor,
            councillor,
            districtDirector,
            districtCouncilor,
            updatedBy,
            alreadyVoted,
        })
        .then((data) => {
            if (data[0]) {
                res.status(200).json({
                    message: "poll has edited succesfully!",
                });
            } else {
                res.status(404).json({ message: "Invalid ID" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ message: err });
        });
};

module.exports = {
    getAllPolls,
    getPollById,
    updatePollService,
};
