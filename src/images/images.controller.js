const path = require('path')
//import path from 'path';
// import fs from 'fs-extra';
const fs = require('fs-extra')

const getImage = async (req, res) => {
        const type = req.params.type;
        const image = req.params.image;
        const pathImage = path.resolve( __dirname, `../census/pictures/${image}`);
        if (await fs.existsSync(pathImage)) {
            res.sendFile(pathImage)
        } else {
            let pathNoImage = '';
                pathNoImage = path.resolve( __dirname, `../census/pictures/nobody.jpg`);
            res.sendFile(pathNoImage);
        }
    }


module.exports = {
    getImage
}
