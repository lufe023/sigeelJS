const dashboardController = require("./dashboard.controller")


const MyCitizensDataServices = (req, res) =>{
const {userId} = req.params
const {campainId} = req.params

if(!campainId){ 
    const campainId = null
}

dashboardController
.MyCitizensDataController(userId, campainId)
.then(dashboard=>{
    res.status(200).json({
        dashboard
    })
})
.catch((err) => { res.status(400).json({err})});
}


module.exports = {
    MyCitizensDataServices
}