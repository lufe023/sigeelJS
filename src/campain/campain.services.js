const campainControllers = require('./campain.controller')

//ver todas las campañas
const getAllCampains = (req, res) => {


    campainControllers
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

            campainControllers.createCampains({
        
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

module.exports = {
    getAllCampains,
    createNewCampain
}