const path = require("path");
const fs = require("fs-extra");
const { dbFotos } = require("../utils/database");
const { QueryTypes } = require("sequelize");
const sharp = require("sharp");

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
                x="50%" 
                y="50%" 
                font-size="16" 
                fill="white" 
                font-family="Arial, sans-serif" 
                font-weight="bold" 
                text-anchor="middle" 
                dominant-baseline="middle"
                dy="6">
                MEL
            </text>
        </svg>
    `;
    const overlay = Buffer.from(overlaySVG);

    const cleaned = await image
        .composite([{ input: overlay, top: top, left: left }])
        .jpeg({ quality: 100 })
        .toBuffer();

    const outputPath = path.join(folderPath, `${cedula}.jpg`);

    await fs.ensureDir(folderPath);
    await fs.writeFile(outputPath, cleaned);

    console.log(`✅ Imagen ${cedula}.jpg guardada en ${folderPath}`);
    return outputPath;
}

// Traer imagen desde DB
const fetchCitizenImageFromDB = async (cedula, folderPath) => {
    try {
        const [foto] = await dbFotos.query(
            "SELECT Imagen FROM FOTOS_BIS_BIS WHERE Cedula = :cedula",
            {
                replacements: { cedula },
                type: QueryTypes.SELECT,
            }
        );

        if (!foto || !foto.Imagen) {
            console.log(`❌ No se encontró imagen para cédula ${cedula}`);
            return null;
        }

        const imageBuffer = Buffer.isBuffer(foto.Imagen)
            ? foto.Imagen
            : Buffer.from(foto.Imagen, "base64");

        return await limpiarMarcaBIS(imageBuffer, cedula, folderPath);
    } catch (error) {
        console.error("❌ Error obteniendo imagen desde DB externa:", error);
        return null;
    }
};

// -------------------------------------------
// Obtener imagen según tipo
// -------------------------------------------
const getImage = async (req, res) => {
    const type = req.params.type;
    const image = req.params.image;
    let pathImage;

    if (type === "citizen") {
        pathImage = path.resolve(
            __dirname,
            `../../uploads/images/citizens/${image}`
        );

        if (!fs.existsSync(pathImage)) {
            console.log(
                `⚠️ Imagen ${image} no encontrada en disco. Buscando en base externa...`
            );
            const newImagePath = await fetchCitizenImageFromDB(image);

            if (newImagePath) {
                pathImage = newImagePath; // usar la recién creada
            }
        }
    }

    if (type === "candidate") {
        pathImage = path.resolve(
            __dirname,
            `../../uploads/images/candidates/${image}`
        );
    }

    if (type === "user") {
        pathImage = path.resolve(
            __dirname,
            `../../uploads/images/users/${image}`
        );
    }

    if (type === "teams") {
        pathImage = path.resolve(
            __dirname,
            `../../uploads/images/teams/${image}`
        );
    }

    if (type === "qr") {
        pathImage = path.resolve(__dirname, `../whatsapp/qr/qr.png`);
    }

    if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage);
    } else {
        const pathNoImage = path.resolve(
            __dirname,
            `../../uploads/images/system/nobody.jpg`
        );
        return res.sendFile(pathNoImage);
    }
};

const getCitizenImage = async (req, res) => {
    const { municipio, cedula } = req.params;

    const folderPath = path.resolve(
        __dirname,
        `../../uploads/images/citizens/${municipio}`
    );
    const filePath = path.join(folderPath, `${cedula}.jpg`);

    if (await fs.pathExists(filePath)) {
        return res.sendFile(filePath);
    }

    console.log(
        `⚠️ Imagen ${cedula} no encontrada en ${folderPath}, buscando en DB...`
    );
    const newImagePath = await fetchCitizenImageFromDB(cedula, folderPath);

    if (newImagePath && (await fs.pathExists(newImagePath))) {
        return res.sendFile(newImagePath);
    }

    // Si no existe, devolver imagen por defecto
    const pathNoImage = path.resolve(
        __dirname,
        `../../uploads/images/system/nobody.jpg`
    );
    return res.sendFile(pathNoImage);
};

// -------------------------------------------
// Borrar imagen
// -------------------------------------------
const deleteImageController = async (folder, imageName) => {
    console.log(`Antes de borrar la imagen: ${folder}/${imageName}`);
    try {
        const imagePath = path.resolve(
            __dirname,
            `../../uploads/images/${folder}/${imageName}`
        );
        if (await fs.existsSync(imagePath)) {
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
    console.log(`Antes de borrar la imagen: ${folder}/${imageName}`);
    try {
        const imagePath = path.resolve(__dirname, `${folder}/${imageName}`);
        if (await fs.existsSync(imagePath)) {
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
