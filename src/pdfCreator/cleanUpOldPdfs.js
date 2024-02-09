const fs = require('fs');
const path = require('path');

const cleanUpOldPdfs = (citizenID) => {
    const directoryPath = path.resolve(__dirname, './');
    fs.readdir(directoryPath, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            if (file.includes(citizenID)) {
                fs.unlink(path.join(directoryPath, file), err => {
                    if (err) throw err;
                });
            }
        });
    });
};

module.exports = {
    cleanUpOldPdfs
}