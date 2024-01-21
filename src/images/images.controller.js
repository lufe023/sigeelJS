const path = require('path')
//import path from 'path';
// import fs from 'fs-extra';
const fs = require('fs-extra')

const getImage = async (req, res) => {
        const type = req.params.type;
        const image = req.params.image;

        //condicionando la ruta se gun la foto que se pida
        let pathImage
        if(type=="citizen"){
        pathImage = path.resolve( __dirname, `../../uploads/images/citizens/${image}`);
        }

        if(type=="candidate"){
            pathImage = path.resolve( __dirname, `../../uploads/images/candidates/${image}`);
        }

        if(type=="user"){
            pathImage = path.resolve( __dirname, `../../uploads/images/candidates/${image}`);
        }
        if(type=="teams"){
            //funcionando
            pathImage = path.resolve( __dirname, `../../uploads/images/teams/${image}`);
        }

        if (await fs.existsSync(pathImage)) {
            res.sendFile(pathImage)
        }
        else 
        {
            let pathNoImage = '';
                pathNoImage = path.resolve( __dirname, `../../uploads/images/system/nobody.jpg`);
            res.sendFile(pathNoImage);
        }
    }

    const deleteImageController = async (folder, imageName) => {
        console.log(`Antes de borrar la imagen: ${folder}/${imageName}`);
        try {
            const imagePath = path.resolve(__dirname, `../../uploads/images/${folder}/${imageName}`);
    
            if (await fs.existsSync(imagePath)) {
                // Borra la imagen
                await fs.unlink(imagePath);
                return { success: true, message: 'Imagen borrada correctamente' };
            } else {
                return { success: false, message: 'La imagen no existe' };
            }
        } catch (error) {
            return { success: false, message: 'Error al borrar la imagen' };
        }
        
    };
        

module.exports = {
    getImage,
    deleteImageController
}
