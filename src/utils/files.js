//Listar archivos.
const path = require('path');
const fs = require('fs');

var data=[];

console.log("Buscando...")
function scanDirs(directoryPath){
   try{
      var ls=fs.readdirSync(directoryPath);

      for (let index = 0; index < ls.length; index++) {
         const file = path.join(directoryPath, ls[index]);
         var dataFile =null;
         try{
            dataFile =fs.lstatSync(file);
         }catch(e){}

         if(dataFile){
           
            data.push(
               {
                  divi: file.split('\\')[5]
               });

            if(dataFile.isDirectory()){
               scanDirs(file)
            }
         }
      }
   }catch(e){}
}

scanDirs('../../uploads/images/citizens');

const jsonString = JSON.stringify(data);

fs.writeFile('./resultado.json', jsonString, err => {
   if (err) {
      console.log('Error al escribir en el archivo', err)
   } else {
      console.log('Archivo guardado.')
   }
});