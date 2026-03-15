const inTouchController = require("./inTouch.controller");

const createConditionServices = (req, res) => {
    //extracion y declaracion de las variables y los datos a enviar
    const citizenId = req.params.id;
    const {
        conditionDetails,
        dyslexia,
        visual,
        auditory,
        motor,
        cognitive,
        outside,
    } = req.body;

    if (conditionDetails && citizenId) {
        inTouchController
            .createConditionController(citizenId, {
                conditionDetails,
                dyslexia,
                visual,
                auditory,
                motor,
                cognitive,
                outside,
            })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    } else {
        res.status(400).json({
            message: `debe llenar los campos citizenId: que se toma del parametro de la url y conditionDetails que se envia en el body`,
            citizenId,
            conditionDetails,
        });
    }
    // .then((data) => {res.status(200).json(data)})
    // .catch((err) => {res.status(400).json({ message: err })})
};

const updateConditionService = (req, res) => {
    //extracion y declaracion de las variables y los datos a enviar
    const citizenId = req.params.id;

    const {
        conditionDetails,
        dyslexia,
        visual,
        auditory,
        motor,
        cognitive,
        outside,
    } = req.body;
    if (citizenId) {
        inTouchController;
        inTouchController
            .updateConditionController(citizenId, {
                conditionDetails,
                dyslexia,
                visual,
                auditory,
                motor,
                cognitive,
                outside,
            })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    } else {
        res.status(400).json({
            message:
                "debe llenar los campos citizenId: que se toma del parametro de la url y conditionDetails que se envia en el body",
        });
    }
};

//create new participation service
const createParticipationServices = (req, res) => {
    //extracion y declaracion de las variables y los datos a enviar
    const citicenID = req.params.id;
    const { activityDescription, receiveAt } = req.body;

    if (citicenID && activityDescription && receiveAt) {
        inTouchController
            .addParticipationController(
                citicenID,
                activityDescription,
                receiveAt
            )
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    } else {
        res.status(400).json({
            message: `debe llenar los campos citicenID, activityDescription, receiveAt que se envia en el body`,
            citicenID,
            activityDescription,
        });
    }
};

const deleteParticipationServices = (req, res) => {
    const activityId = req.params.activityid;

    inTouchController
        .deleteParticipationController(activityId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

//create new Benefit service
const createBenefitServices = (req, res) => {
    //extracion y declaracion de las variables y los datos a enviar
    const citicenID = req.params.id;
    const { benefitDescription, receiveAt } = req.body;

    if (citicenID && benefitDescription && receiveAt) {
        inTouchController
            .addBeneficitController(citicenID, benefitDescription, receiveAt)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    } else {
        res.status(400).json({
            message: `debe llenar los campos citicenID, activityDescription, receiveAt que se envia en el body`,
            citicenID,
            benefitDescription,
        });
    }
};

//eliminar un beneficio
const deleteBenefitServices = (req, res) => {
    const benefitId = req.params.benefitid;

    inTouchController
        .deleteBenefitController(benefitId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

//create new Job service
const createJobServices = (req, res) => {
    //extracion y declaracion de las variables y los datos a enviar
    const citicenID = req.params.id;
    const { institution, position, positionDetails, startedAt, finishAt } =
        req.body;

    if ((citicenID && institution, position)) {
        inTouchController
            .addJobController(
                citicenID,
                institution,
                position,
                positionDetails,
                startedAt,
                finishAt
            )
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    } else {
        res.status(400).json({
            message: `debe enviar todos los campos que son obligatorios`,
            fields: "citicenID: Obligatorio, institution: Obligatorio, position: Obligatorio, positionDetails: Opcional, startedAt: Opcional, finishAt: Opcional",
        });
    }
};

//eliminar un Trabajo
const deleteJobServices = (req, res) => {
    const jobId = req.params.jobid;

    inTouchController
        .deleteJobController(jobId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

module.exports = {
    createConditionServices,
    updateConditionService,
    createParticipationServices,
    deleteParticipationServices,
    createBenefitServices,
    deleteBenefitServices,
    createJobServices,
    deleteJobServices,
};
