const dashboardController = require("./dashboard.controller")


const MyCitizensDataServices = (req, res) =>{
const {id} = req.params

dashboardController
.MyCitizensDataController(id)
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