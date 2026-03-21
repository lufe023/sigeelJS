const path = require("path");
const fs = require("fs-extra");
const { dbFotos } = require("../utils/database");
const { QueryTypes } = require("sequelize");
const sharp = require("sharp");

// -------------------------------------------------------------------------
// Constantes y Configuración
// -------------------------------------------------------------------------
const PATH_NO_IMAGE = path.resolve(
    __dirname,
    "../../uploads/images/system/nobody.jpg",
);
const BASE_UPLOAD_DIR = path.resolve(
    __dirname,
    "../../uploads/images/citizens",
);

// Mapa para evitar que múltiples peticiones procesen la misma imagen al mismo tiempo
const pendingImageProcesses = new Map();

// ---------------------------
// Cubrir marca BIS en la imagen
// ---------------------------
async function limpiarMarcaBIS(imageBuffer, cedula, folderPath) {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    const rectWidth = 38;
    const rectHeight = 23;
    const left = Math.round((metadata.width - rectWidth) / 2);
    const top = metadata.height - rectHeight;

    const overlaySVG = `
        <svg width="${rectWidth}" height="${rectHeight}">
            <rect width="${rectWidth}" height="${rectHeight}" fill="black" />
            <text 
                x="50%" y="50%" font-size="16" fill="white" 
                font-family="Arial, sans-serif" font-weight="bold" 
                text-anchor="middle" dominant-baseline="middle" dy="6">
                MEL
            </text>
        </svg>
    `;
    const overlay = Buffer.from(overlaySVG);

    // CAMBIO AQUÍ: Usamos .webp() en lugar de .jpeg()
    const cleaned = await image
        .composite([{ input: overlay, top: top, left: left }])
        .webp({ 
            quality: 80,     // Calidad vs peso
            effort: 6,      // Mayor esfuerzo de compresión (0-6)
            lossless: false // Compresión con pérdida para máximo ahorro
        })
        .toBuffer();

    // CAMBIO AQUÍ: Extensión .webp
    const outputPath = path.join(folderPath, `${cedula}.webp`);

    await fs.ensureDir(folderPath);
    await fs.writeFile(outputPath, cleaned);

    console.log(`✅ Imagen ${cedula}.webp guardada y optimizada.`);
    return outputPath;
}

// ---------------------------
// Traer imagen desde DB
// ---------------------------
const fetchCitizenImageFromDB = async (cedula, folderPath) => {
    // Si ya hay un proceso en marcha para esta cédula, devolvemos su promesa
    if (pendingImageProcesses.has(cedula)) {
        return pendingImageProcesses.get(cedula);
    }

    const processPromise = (async () => {
        try {
            const [foto] = await dbFotos.query(
                "SELECT Imagen FROM FOTOS_BIS_BIS WHERE Cedula = :cedula",
                {
                    replacements: { cedula },
                    type: QueryTypes.SELECT,
                },
            );

            if (!foto || !foto.Imagen) {
                console.log(`❌ No se encontró imagen para cédula ${cedula}`);
                return null;
            }

            const imageBuffer = Buffer.isBuffer(foto.Imagen)
                ? foto.Imagen
                : Buffer.from(foto.Imagen, "base64");

            // folderPath es opcional si viene de getImage, aseguramos uno por defecto
            const finalPath =
                folderPath || path.join(BASE_UPLOAD_DIR, "default");

            return await limpiarMarcaBIS(imageBuffer, cedula, finalPath);
        } catch (error) {
            console.error(
                "❌ Error obteniendo imagen desde DB externa:",
                error,
            );
            return null;
        } finally {
            // Importante: Eliminar del mapa al terminar para permitir futuros re-procesos si fallara
            pendingImageProcesses.delete(cedula);
        }
    })();

    pendingImageProcesses.set(cedula, processPromise);
    return processPromise;
};

// -------------------------------------------
// Obtener imagen según tipo (Ruta General)
// -------------------------------------------
const getImage = async (req, res) => {
    const { type, image } = req.params;
    let pathImage;

    // Opciones de caché para el navegador (30 días)
    const cacheOptions = { maxAge: "30d" };

    if (type === "citizen") {
        // Quitamos la extensión si el cliente la manda para evitar .jpg.jpg
        const cleanCedula = image.replace(/\.[^/.]+$/, "");
        pathImage = path.join(BASE_UPLOAD_DIR, cleanCedula + ".jpg");

        if (!fs.existsSync(pathImage)) {
            console.log(
                `⚠️ Imagen ${cleanCedula} no encontrada. Buscando en DB...`,
            );
            const newImagePath = await fetchCitizenImageFromDB(cleanCedula);
            if (newImagePath) pathImage = newImagePath;
        }
    } else if (type === "candidate") {
        pathImage = path.resolve(
            __dirname,
            `../../uploads/images/candidates/${image}`,
        );
    } else if (type === "user") {
        pathImage = path.resolve(
            __dirname,
            `../../uploads/images/users/${image}`,
        );
    } else if (type === "teams") {
        pathImage = path.resolve(
            __dirname,
            `../../uploads/images/teams/${image}`,
        );
    } else if (type === "qr") {
        pathImage = path.resolve(__dirname, `../whatsapp/qr/qr.png`);
    }

    // Verificación final y envío
    if (pathImage && fs.existsSync(pathImage)) {
        return res.sendFile(pathImage, cacheOptions);
    } else {
        return res.sendFile(PATH_NO_IMAGE);
    }
};

// -------------------------------------------
// Obtener imagen de Ciudadano (Ruta por Municipio)
// -------------------------------------------
const getCitizenImage = async (req, res) => {
    const { municipio, cedula } = req.params;
    const folderPath = path.join(BASE_UPLOAD_DIR, municipio);
    const filePath = path.join(folderPath, `${cedula}.jpg`);

    const cacheOptions = { maxAge: "30d" };

    try {
        // Intentar enviar el archivo (si existe, res.sendFile lo hace de inmediato)
        return res.sendFile(filePath, cacheOptions, async (err) => {
            if (err) {
                // Si el error es porque no existe (code 404/ENOENT implicito)
                console.log(
                    `⚠️ Imagen ${cedula} no en disco, buscando en DB...`,
                );
                const newImagePath = await fetchCitizenImageFromDB(
                    cedula,
                    folderPath,
                );

                if (newImagePath && fs.existsSync(newImagePath)) {
                    return res.sendFile(newImagePath, cacheOptions);
                } else {
                    return res.sendFile(PATH_NO_IMAGE);
                }
            }
        });
    } catch (error) {
        return res.sendFile(PATH_NO_IMAGE);
    }
};

// -------------------------------------------
// Borrar imagen
// -------------------------------------------
const deleteImageController = async (folder, imageName) => {
    try {
        const imagePath = path.resolve(
            __dirname,
            `../../uploads/images/${folder}/${imageName}`,
        );
        if (fs.existsSync(imagePath)) {
            await fs.unlink(imagePath);
            return { success: true, message: "Imagen borrada correctamente" };
        } else {
            return { success: false, message: "La imagen no existe" };
        }
    } catch (error) {
        return { success: false, message: "Error al borrar la imagen" };
    }
};

const deleteQrImage = async (folder, imageName) => {
    try {
        const imagePath = path.resolve(__dirname, `${folder}/${imageName}`);
        if (fs.existsSync(imagePath)) {
            await fs.unlink(imagePath);
            return { success: true, message: "Imagen borrada correctamente" };
        } else {
            return { success: false, message: "La imagen no existe" };
        }
    } catch (error) {
        return { success: false, message: "Error al borrar la imagen" };
    }
};

module.exports = {
    getImage,
    getCitizenImage,
    deleteImageController,
    deleteQrImage,
};
