const router = require("express").Router();

const imagencontroller = require("./images.controller");

// devuelvve una imagen por typo y nombre
router.get("/", imagencontroller.getImage);
router.get("/pic/:provincia/:municipio/:recinto/:colegio/:cedula", imagencontroller.getCitizenImage);
router.get("/:type/:image", imagencontroller.getImage);
router.get("/default-image", imagencontroller.getDefaultImageUrl);

router.post("/generate-by-municipio", 
    // passport.authenticate("jwt", { session: false }), // Descomentar para seguridad
    // adminValidate, 
    imagencontroller.generateImagesByMunicipio
);
module.exports = router;
