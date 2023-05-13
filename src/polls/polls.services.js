const pollsControllers = require('./polls.controller')


const getAllPolls = (req, res) => {
    pollsControllers
    .getAllPolls()
    .then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        res.status(400).json({ message: err.message });
    });
}

//una encuesta por id
const getPollById = (req, res) => {
    const {id} = req.params
    pollsControllers.getPollById(id)

    .then((poll) => 
                {
                    res.status(201).json({poll})
                })
            
            .catch((err) => {
            res.status(400).json({
                Error: err.err
            })
        })
}

//ver todas las campañas
const getAllCampains = (req, res) => {
    pollsControllers
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
        neighbourhood,
        distrito_municipal,
        municipio,
        provincia,
        startAt,
        finishAt,
        isActive
        } = req.body
        
        const createdBy = req.user.id

        if( name && details && startAt && finishAt && municipio)
        {

                pollsControllers.createCampains({
        
                    name,
                    details,
                    neighbourhood,
                    distrito_municipal,
                    municipio,
                    provincia,
                    createdBy,
                    startAt,
                    finishAt,
                    isActive
                    })
                .then((resultado) => 
                {
                    res.status(201).json({resultado})
                })
            
            .catch((err) => {
            res.status(400).json({
                Error: err.err
            });
        });
        
        } else {
        //? Error cuando no mandan todos los datos necesarios para crear un usuario
        res.status(400).json({
            message: "All fields must be completed"
        })
        }
}

//actualizacion de las encuestas
const updatePollService = (req, res) => {
    const pollId = req.params.id
    
    const updatedBy = req.user.id

    const {preferedParty, electorType, president, senator, diputy, mayor, councillor, districtDirector, districtCouncilor, alreadyVoted } = req.body;

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
        alreadyVoted
    })
    .then((data) => {
        if (data[0]) {
        res
        .status(200)
        .json({ message: 'poll has edited succesfully!'});
        } else {
        res.status(404).json({ message: "Invalid ID"});
        }
    })
    .catch((err) => {
        res.status(400).json({ message: err});
    });
};

module.exports = {
    getAllPolls,
    getAllCampains,
    createNewCampain,
    getPollById,
    updatePollService
}