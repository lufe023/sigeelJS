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
.catch((err) => { res.status(400).json({
    "dashboard": [
        {
            "ciudadanos": {
                "count": 0,
                "rows": [

                ]
            },
            "Activities": 0,
            "Beneficios": 0,
            "Encuestas": {
                "total": 0,
                "Completas": 0,
                "Incompletas": 0,
                "percent_complete": 0,
                "percent_incomplete": 100
            },
            "preferedParty": [
            
            ],
            "preferedPresident": [],
            "preferedSenator": [],
            "preferedDiputy": [],
            "preferedMayor": [],
            "preferedCouncillor": [],
            "preferedDistrictDirector": [],
            "preferedDistrictCouncillor": []
        }
    ]
})});
}


module.exports = {
    MyCitizensDataServices
}