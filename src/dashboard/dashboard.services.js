const dashboardController = require("./dashboard.controller")


const MyCitizensDataServices = (req, res) =>{
// const {userId} = req.params
// const {campainId} = req.params

const {campainId} = req.query || 0
const {user} = req.query

// res.status(200).json({campainId, user})

dashboardController
.MyCitizensDataController(user, campainId)
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