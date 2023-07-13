const gpsController = require("./gps.controller")


const getCitizensNearbyService = (req, res)=> {
    
    const { citizenID } = req.params;
    const {meters} = req.params

    gpsController
    .getCitizensNearby(citizenID, meters)
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ err })});
}

const newGPSLocationService = (req, res) => {
    const { citizenID } = req.params;
}

module.exports = { getCitizensNearbyService };