const reportController = require('./reports.controller')

const getCampainReport = (req, res) => {

    const {campainId} = req.body
    if(campainId){
    reportController.getCampainReport(campainId)
    .then((data) => {res.status(200).json(data);})
    .catch((err) => {res.status(400).json({ message: err })});
    }else{
        res.status(400).json({ message: "debe enviar como parametro de la URL campainId de tipo uuid" })
    }
};

//reporte para obtener los partidos por campaña
const getPartyReport = (req, res) => {
const campainId = req.query.campainId
    if(campainId){
    reportController.getPartyReport(campainId)
    .then((data) => {res.status(200).json(data);})
    .catch((err) => {res.status(400).json({ message: err })});
    }else{
        res.status(400).json({ message: "debe enviar como parametro campainId de tipo uuid" })
    }
};

// controlador para reportes de encuestas pero en el colegio electoral que se seleccione
const getPartyCollegeReportService = (req, res) => {
    const campainId = req.query.campainId
    const collegeId = req.query.collegeId

        if(campainId && collegeId){
        reportController.getPartyCollegeReportController(collegeId, campainId)
        .then((data) => {res.status(200).json(data);})
        .catch((err) => {res.status(400).json({ message: err })});
        }else{
            res.status(400).json({ message: "debe enviar como parametro campainId de tipo uuid y collegeId de tipo integer" })
        }
    };


    //reporte para obtener los partidos por campaña
const getPreferedPresidentReportByPlaceService = (req, res) => {
    const campainId = req.query.campainId
        if(campainId){
        reportController.getPreferedPresidentReportByPlaceController(campainId)
        .then((data) => {res.status(200).json(data);})
        .catch((err) => {res.status(400).json({ message: err })});
        }else{
            res.status(400).json({ message: "debe enviar como parametro campainId de tipo uuid" })
        }
    };


    //reporte para obtener los partidos por campaña
const bocaUrnaService = (req, res) => {
  
  const college = req.query.college
  const campain = req.query.campain

        reportController.bocaUrna(college,campain)
        .then((data) => {res.status(200).json(data);})
        .catch((err) => {res.status(400).json({ err })});
    };

    const bocaUrnaServiceAlcalde = (req, res) => {
  
        const college = req.query.college
        const campain = req.query.campain
      
              reportController.bocaUrnaAlcalde(college,campain)
              .then((data) => {res.status(200).json(data);})
              .catch((err) => {res.status(400).json({ err })});
          };

const getPrecinctCoverageReportService = (req, res) => {
    const precinctId = req.query.precinctId || req.query.precinct

    if (precinctId) {
        reportController.getPrecinctCoverageReportController(precinctId)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: "recinto no encontrado" })
            }

            res.status(200).json(data);
        })
        .catch((err) => {res.status(400).json({ err })});
    } else {
        res.status(400).json({
            message: "debe enviar como parametro precinctId de tipo integer",
        })
    }
}

const getLeaderCoverageReportService = (req, res) => {
    const municipalityId = req.query.municipalityId || req.query.municipality
    const districtId = req.query.districtId || req.query.district
    const leaderGoal = req.query.leaderGoal || req.query.leadergoal || 10

    if (!municipalityId && !districtId) {
        return res.status(400).json({
            message: "debe enviar municipalityId o districtId como parametro",
        })
    }

    reportController.getLeaderCoverageReportController({
        municipalityId,
        districtId,
        leaderGoal,
    })
    .then((data) => {
        if (!data) {
            return res.status(404).json({ message: "no se encontraron líderes con esos parámetros" })
        }

        res.status(200).json(data);
    })
    .catch((err) => {res.status(400).json({ err })});
}
module.exports = {
    getCampainReport,
    getPartyReport,
    getPartyCollegeReportService,
    getPreferedPresidentReportByPlaceService,
    bocaUrnaService,
    bocaUrnaServiceAlcalde,
    getPrecinctCoverageReportService,
    getLeaderCoverageReportService
}
