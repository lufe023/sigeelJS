const router = require("express").Router();
const passport = require("passport");
const { adminValidate, superAdminValidate } = require("../middlewares/role.middleware");
const advice = require("./advice.services");

require("../middlewares/auth.middleware")(passport);

// Rutas para anuncios (Advice/Announcements)

// GET /api/v1/advice - Obtener todos los anuncios (con filtros opcionales)
// Acceso: Colaborador+ (role >= 1)
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    advice.getAllAdvice
);

// GET /api/v1/advice/admin/all - Obtener todos los anuncios (admin - sin restricción de fechas)
// Acceso: Admin+ (role >= 2)
router.get(
    "/admin/all",
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    advice.getAllAdviceAdmin
);

// GET /api/v1/advice/:id - Obtener un anuncio por ID
// Acceso: Colaborador+ (role >= 1)
router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    advice.getAdviceById
);

// POST /api/v1/advice - Crear un nuevo anuncio
// Acceso: Admin+ (role >= 2)
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    advice.upload.single("image_url"),
    advice.createAdvice
);

// PUT /api/v1/advice/:id - Actualizar un anuncio
// Acceso: Admin+ (role >= 2)
router.put(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    advice.upload.single("image_url"),
    advice.updateAdvice
);

// DELETE /api/v1/advice/:id - Eliminar un anuncio (soft delete)
// Acceso: Admin+ (role >= 2)
router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    advice.deleteAdvice
);

// PUT /api/v1/advice/:id/toggle-active - Alternar estado active del anuncio
// Acceso: Admin+ (role >= 2)
router.put(
    "/:id/toggle-active",
    passport.authenticate("jwt", { session: false }),
    adminValidate,
    advice.toggleAdviceActive
);

module.exports = router;
