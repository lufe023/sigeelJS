const router = require("express").Router();

const imagencontroller = require("./images.controller");

// devuelvve una imagen por typo y nombre
router.get("/", imagencontroller.getImage);
router.get("/pic/mun/:municipio/:cedula", imagencontroller.getCitizenImage);
router.get("/:type/:image", imagencontroller.getImage);
module.exports = router;
