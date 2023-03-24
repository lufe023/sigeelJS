const mapsController = require('./maps.controller')

const getAllMaps = (req, res) => {

    mapsController
    .getAllMaps()
    .then((data) => {
        res.status(200).json(data);
        })
    .catch((err) => {
        res.status(400).json({ message: err });
        });

}

const createNewMap = (req, res) => {

    const {
        name,
        parent,
        type
        } = req.body

    if(name && parent && type)
    {
        mapsController.createNewMap({
            name,
            parent,
            type
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
            name: `string, ${name}`,
            parent: `integer, ${parent}`,
            type: `string, ${type}`
        },
    })
    }
}


module.exports = {
    getAllMaps,
    createNewMap
}