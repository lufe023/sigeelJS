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

module.exports = {
    getImage
}
