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

const createNewCampain = (req, res) => {
    const {
        name,
        details,
        neighbourhood,
        distrito_municipal,
        municipio,
        provincia
        } = req.body
        
        const createdBy = req.user.id

        if( name && details)
        {
        pollsControllers.createCampain({
            name,
            details,
            neighbourhood,
            distrito_municipal,
            municipio,
            provincia,
            createdBy
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
            message: "All fields must be completed"
        })
        }
}

module.exports = {
    getAllPolls,
    createNewCampain
}