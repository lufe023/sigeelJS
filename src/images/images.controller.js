const path = require("path");
//import path from 'path';
// import fs from 'fs-extra';
const fs = require("fs-extra");
const { dbFotos } = require("../utils/database");
const { QueryTypes } = require("sequelize");

const getImage = async (req, res) => {
    const type = req.params.type;
    const image = req.params.image;
    let pathImage;

    if (type === "citizen") {
        pathImage = path.resolve(
            __dirname,
            `../../uploads/images/citizens/${image}`
        );

        // Si no existe, intentar obtener desde la DB externa
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

    // Enviar imagen si existe, si no el "nobody"
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

// ✅ versión actualizada: se conecta a la base SQL de fotos

const deleteImageController = async (folder, imageName) => {
    console.log(`Antes de borrar la imagen: ${folder}/${imageName}`);
    try {
        const imagePath = path.resolve(
            __dirname,
            `../../uploads/images/${folder}/${imageName}`
        );

        if (await fs.existsSync(imagePath)) {
            // Borra la imagen
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
            // Borra la imagen
            await fs.unlink(imagePath);
            return { success: true, message: "Imagen borrada correctamente" };
        } else {
            return { success: false, message: "La imagen no existe" };
        }
    } catch (error) {
        return { success: false, message: "Error al borrar la imagen" };
    }
};

const fetchCitizenImageFromDB = async (cedula) => {
    try {
        const [foto] = await dbFotos.query(
            "SELECT Imagen FROM FOTOS_BIS_BIS WHERE Cedula = :cedula",
            {
                replacements: { cedula },
                type: QueryTypes.SELECT,
            }
        );

        if (!foto || !foto.Imagen) {
            console.log(
                `❌ No se encontró imagen para cédula ${cedula} en DB.`
            );
            return null;
        }

        // Si el campo viene como base64
        const imageBuffer = Buffer.isBuffer(foto.Imagen)
            ? foto.Imagen // si ya viene como buffer (varbinary)
            : Buffer.from(foto.Imagen, "base64");

        const outputPath = path.resolve(
            __dirname,
            `../../uploads/images/citizens/${cedula}.jpg`
        );

        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, imageBuffer);

        console.log(`✅ Imagen ${cedula}.jpg guardada localmente.`);
        return outputPath;
    } catch (error) {
        console.error("❌ Error obteniendo imagen desde DB externa:", error);
        return null;
    }
};

module.exports = {
    getImage,
    deleteImageController,
    deleteQrImage,
};
