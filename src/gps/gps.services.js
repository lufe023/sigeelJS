const gpsController = require("./gps.controller")


const getCitizensNearbyService = (req, res)=> {
    
    const { citizenID } = req.params;

    gpsController
    .getCitizensNearby(citizenID)
    .then((data) => {res.status(200).json(data)})
    .catch((err) => {res.status(400).json({ err })});
}


module.exports = { getCitizensNearbyService };