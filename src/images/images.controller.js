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

    return outputPath;
}

// ---------------------------
// Traer imagen desde DB
// ---------------------------
const fetchCitizenImageFromDB = async (cedula, folderPath) => {
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

            // 1. Definir la ruta final
            const finalPath = folderPath || path.join(BASE_UPLOAD_DIR, "default");

            // 2. CAMBIO IMPORTANTE: Asegurar que TODA la jerarquía de carpetas exista
            // Esto evita errores si la provincia/municipio/colegio es nuevo en el disco
            await fs.ensureDir(finalPath);

            // 3. Procesar y guardar (limpiarMarcaBIS ya genera el .webp)
            return await limpiarMarcaBIS(imageBuffer, cedula, finalPath);

        } catch (error) {
            console.error("❌ Error obteniendo imagen desde DB externa:", error);
            return null;
        } finally {
            pendingImageProcesses.delete(cedula);
        }
    })();

    pendingImageProcesses.set(cedula, processPromise);
    return processPromise;
};

const getDefaultImageUrl = (req, res) => {
    const defaultImagePath = path.resolve(__dirname, "../../uploads/images/system/nobody.jpg");

    // Verifica si el archivo existe antes de enviarlo
    if (fs.existsSync(defaultImagePath)) {
        res.sendFile(defaultImagePath);
    } else {
        res.status(404).json({ error: "Imagen predeterminada no encontrada." });
    }
};
// -------------------------------------------
// Obtener imagen según tipo (Ruta General)
// -------------------------------------------
const getImage = async (req, res) => {
    const { type, image } = req.params;
    let pathImage;
    const cacheOptions = { maxAge: "30d" };

    if (type === "citizen") {
        // 1. Limpiamos la cédula (por si viene con .jpg o .webp desde el front)
        const cleanCedula = image.replace(/\.[^/.]+$/, "");
        
        // 2. OJO: Si usas la función GENÉRICA, no tienes la jerarquía (prov/mun).
        // Si el front no manda la ruta completa, tendrás que decidir si las guardas
        // en una carpeta "default" o si esta función debe ser deprecada para ciudadanos.
        const defaultFolder = path.join(BASE_UPLOAD_DIR, "default");
        pathImage = path.join(defaultFolder, `${cleanCedula}.webp`);

        // 3. Buscar el archivo WebP
        if (!fs.existsSync(pathImage)) {
            console.log(`⚠️ Imagen WebP ${cleanCedula} no encontrada en default. Buscando en DB...`);
            
            // fetchCitizenImageFromDB ahora devuelve la ruta al .webp generado
            const newImagePath = await fetchCitizenImageFromDB(cleanCedula, defaultFolder);
            if (newImagePath) pathImage = newImagePath;
        }
    } else {
        // Lógica para otros tipos (candidate, user, etc.)
        // Si estos siguen siendo .jpg o .png, se quedan igual
        const folderMap = {
            candidate: "../../uploads/images/candidates/",
            user: "../../uploads/images/users/",
            teams: "../../uploads/images/teams/",
        };

        if (folderMap[type]) {
            pathImage = path.resolve(__dirname, folderMap[type], image);
        } else if (type === "qr") {
            pathImage = path.resolve(__dirname, `../whatsapp/qr/qr.png`);
        }
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
    const { provincia, municipio, recinto, colegio, cedula } = req.params;
    
    // Construimos la ruta jerárquica basada en los parámetros del frontend
    const folderPath = path.join(
        BASE_UPLOAD_DIR, 
        provincia, 
        municipio, 
        recinto, 
        colegio
    );
    
    // IMPORTANTE: Ahora buscamos .webp que es tu nuevo estándar de ahorro
    const filePath = path.join(folderPath, `${cedula}.webp`);

    const cacheOptions = { maxAge: "30d" };

    try {
        // 1. Intentar enviar el WebP si ya existe en disco
        return res.sendFile(filePath, cacheOptions, async (err) => {
            if (err) {
                // 2. Si no existe (err 404), vamos a la DB externa
                console.log(`⚠️ Imagen ${cedula} no en disco, generando WebP desde DB...`);
                
                // fetchCitizenImageFromDB ya tiene la lógica de sharp y guardado en WebP
                const newImagePath = await fetchCitizenImageFromDB(
                    cedula,
                    folderPath,
                );

                if (newImagePath && fs.existsSync(newImagePath)) {
                    return res.sendFile(newImagePath, cacheOptions);
                } else {
                    // 3. Si no hay foto en ninguna DB, mandamos el placeholder
                    return res.sendFile(PATH_NO_IMAGE);
                }
            }
        });
    } catch (error) {
        console.error("Error crítico en getCitizenImage:", error);
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
    getDefaultImageUrl
};
