const adviceController = require("./advice.controller");
const multer = require("multer");
const path = require("path");

// Configuración de multer para subir imágenes de anuncios
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/images/advice");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, `${Date.now()}.${ext}`);
    },
});

const upload = multer({ storage });

// Servicio para obtener todos los anuncios
const getAllAdvice = (req, res) => {
    const query = req.query;
    const userRole = req.user?.role;

    adviceController
        .getAllAdviceController(query, userRole)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: err.message });
        });
};

// Servicio para obtener todos los anuncios (admin - sin restricción de fechas)
const getAllAdviceAdmin = (req, res) => {
    const query = req.query;

    adviceController
        .getAllAdviceAdminController(query)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: err.message });
        });
};

// Servicio para obtener un anuncio por ID
const getAdviceById = (req, res) => {
    const { id } = req.params;

    adviceController
        .getAdviceByIdController(id)
        .then((advice) => {
            if (!advice) {
                return res.status(404).json({ message: "Anuncio no encontrado" });
            }
            res.status(200).json(advice);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: err.message });
        });
};

// Servicio para crear un nuevo anuncio
const createAdvice = (req, res) => {
    const {
        title,
        dateStart,
        dateEnd,
        message,
        showDelegate,
        showColaborators,
        showAdministrators,
        active,
        type,
        displayLocation,
    } = req.body;

    const image_url = req.file?.filename;
    const createdBy = req.user.id;

    // Validar campos requeridos
    if (!title || !dateStart || !dateEnd || !message || !type) {
        return res.status(400).json({
            message: "Todos los campos requeridos deben ser completados",
            fields: {
                title: "string - requerido",
                dateStart: "date - requerido",
                dateEnd: "date - requerido",
                message: "text - requerido",
                type: "string - requerido",
                image_url: "file - opcional",
                showDelegate: "boolean - opcional",
                showColaborators: "boolean - opcional",
                showAdministrators: "boolean - opcional",
                displayLocation: "string - opcional",
                active: "boolean - opcional",
            },
        });
    }

    adviceController
        .createAdviceController({
            title,
            dateStart,
            dateEnd,
            createdBy,
            image_url,
            message,
            showDelegate,
            showColaborators,
            showAdministrators,
            displayLocation,
            active,
            type,
        })
        .then((data) => {
            res.status(201).json({
                message: "Anuncio creado exitosamente",
                data,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: err.message });
        });
};

// Servicio para actualizar un anuncio
const updateAdvice = (req, res) => {
    const { id } = req.params;
    const {
        title,
        dateStart,
        dateEnd,
        message,
        showDelegate,
        showColaborators,
        showAdministrators,
        active,
        type,
        displayLocation,
    } = req.body;

    const image_url = req.file?.filename;

    const updateData = {
        displayLocation,
        title,
        dateStart,
        dateEnd,
        message,
        showDelegate,
        showColaborators,
        showAdministrators,
        active,
        type,
    };

    // Agregar image_url solo si se subió un nuevo archivo
    if (image_url) {
        updateData.image_url = image_url;
    }

    adviceController
        .updateAdviceController(id, updateData)
        .then((data) => {
            res.status(200).json({
                message: "Anuncio actualizado exitosamente",
                data,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: err.message });
        });
};

// Servicio para eliminar un anuncio
const deleteAdvice = (req, res) => {
    const { id } = req.params;

    adviceController
        .deleteAdviceController(id)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: err.message });
        });
};

// Servicio para alternar estado active del anuncio
const toggleAdviceActive = (req, res) => {
    const { id } = req.params;

    adviceController
        .toggleAdviceActiveController(id)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: err.message });
        });
};

module.exports = {
    getAllAdvice,
    getAllAdviceAdmin,
    getAdviceById,
    createAdvice,
    updateAdvice,
    deleteAdvice,
    toggleAdviceActive,
    upload,
};
