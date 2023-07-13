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
    const {latitud, longitud, gotAutomatic} = req.body
    const createdBy =req.user.id

    if(latitud, longitud){
        gpsController
        .newGPSLocationController(citizenID, latitud, longitud, gotAutomatic, createdBy)
        .then((data) => {res.status(200).json(data)})
        .catch((err) => {res.status(400).json({ err })});
    }else{
    res.status(400).json({ 
        message:"field missing ",
        fields: "latitud =>type: int, longitud =>type: int, gotAutomatic =>type: boolean",
        latitud,
        longitud,
        gotAutomatic
})
    }
}

module.exports = { getCitizensNearbyService, newGPSLocationService};