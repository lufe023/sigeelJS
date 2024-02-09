const path = require('path')
const fs = require('fs');
const PDFDocument = require('pdfkit');
const {MessageMedia } = require('whatsapp-web.js');
const client = require('../whatsapp/whatsappClient');

const censusControllers = require('../census/census.controller')
const moment = require('moment');

const fechaYhora = new Date();
const dia = fechaYhora.getDate().toString().padStart(2, '0'); // Asegura dos dígitos para el día
const mes = (fechaYhora.getMonth() + 1).toString().padStart(2, '0'); // Asegura dos dígitos para el mes
const año = fechaYhora.getFullYear();
const horas = fechaYhora.getHours();
const minutos = fechaYhora.getMinutes().toString().padStart(2, '0');
const user = []
const ties = []
// Convertir formato de 24h a 12h y determinar AM o PM
const horas12 = horas % 12 || 12; // Convierte 0 a 12 para las 12 AM
const amPm = horas < 12 ? 'AM' : 'PM';

// Formatear la hora en formato 12h
let horaFormateada = `${horas12.toString().padStart(2, '0')}:${minutos} ${amPm}`;
let fecha = `${dia}/${mes}/${año} ${horaFormateada}`;

const padroncilloPdf = async (id, number, citizenID) => {
    const timestamp = moment().format('YYYYMMDDHHmm');
    const pdfName = `padroncillo_${citizenID}_${timestamp}.pdf`;

    try{
    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    //doc.pipe(fs.createWriteStream(await path.resolve( __dirname, `./padroncillo_${pdfName}.pdf`)))

    const pdfPath = path.resolve(__dirname, './', pdfName);
    const stream = doc.pipe(fs.createWriteStream(pdfPath));

    const imageExists = (pathImage) => {
        //path.resolve( __dirname, `../../uploads/images/citizens/2110b04b-5048-4e5f-83ea-a2c25291f726.jpg
        let imagen = path.resolve( __dirname, `../../uploads/images/citizens/${pathImage}`);
        if (fs.existsSync(imagen)) { // Verifica si el archivo existe
            return imagen;
        } else {
            // Retorna el camino hacia una imagen por defecto si la original no existe
            return path.resolve(__dirname, `../../uploads/images/system/nobody.jpg`);
        }
    };

    const ciudadanos = await censusControllers.getPeopleByUserToPdf(id);

    user.push(ciudadanos.user)
    ties[0] = ciudadanos.ties

    const citizens = ciudadanos.rows.map(citizen => ({
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        citizenID: citizen.citizenID,
        photo: imageExists(citizen.picture), // Usa la función sincrónica directamente
        address: citizen.address || 'Desconocida',
        phone: citizen.celphone || 'Desconocido',
        college: citizen.colegio.collegeNumber,
        precint: citizen.colegio.precinctData.recintoNombre.split(' ').slice(0,4).join(' ')
    }));

    const vinculos = ties[0].rows.map(vinculo => ({
        firstName: vinculo.bties.firstName,
        lastName: vinculo.bties.lastName,
        citizenID: vinculo.bties.citizenID,
        photo: imageExists(vinculo.bties.picture),
        address: vinculo.bties.address || 'Desconocida',
        phone: vinculo.bties.celphone || 'Desconocido',
        college: vinculo.bties.collegeNumber,
        precint: vinculo.bties.colegio.precinctData.recintoNombre.split(' ').slice(0,4).join(' ')
    }));



const columnWidth = 185;
const columnSpacing = 5;
const boxHeight = 100;
const startY = 150;
const startX = 15;
const citizensPerPage = 15;
let currentPage = 1;
let totalPages = Math.ceil(citizens.length / 15);

//Función para dibujar un cuadro de ciudadano
function drawCitizenBox(citizen, x, y) {
    // Dibujar el rectángulo del cuadro
    doc.rect(x, y, columnWidth, boxHeight).stroke();

    // Dibujar la foto del ciudadano (simulada aquí como un rectángulo)
    //doc.rect(x + 30, y + 10, 50, 50).stroke(); // Simula la posición de la foto

    // Lista de detalles del ciudadano
    const detailsYStart = y + 3;
    const detailsXStart = x + 75;
    const detailsWidth = columnWidth - 90;

    doc.fontSize(10).lineGap(1);

    let currentY = doc.y + 5;
    
    doc.image(citizen.photo, x + 3, y + 3, {width: 70, height: 90});
    doc.fontSize(8).font('Helvetica-Bold').text(`${citizen.firstName} ${citizen.lastName}`, detailsXStart, detailsYStart, { width: detailsWidth });
    currentY = doc.y;
    doc.fontSize(8).font('Helvetica').text(`${citizen.citizenID}`, detailsXStart, currentY, { width: detailsWidth });
    currentY = doc.y;
    doc.text(`Dir: ${citizen.address}`, detailsXStart, currentY, { width: detailsWidth });
    currentY = doc.y;
    doc.text(`Tel: ${citizen.phone}`, detailsXStart, currentY, { width: detailsWidth });
    currentY = doc.y;
    doc.text(`Mesa: ${citizen.college}`, detailsXStart, currentY, { width: detailsWidth });
    currentY = doc.y;
    doc.text(citizen.precint, detailsXStart, currentY, { width: detailsWidth });
}

//Función para dibujar un cuadro de los vinculos
function drawTieBox(citizen, x, y) {
    // Dibujar el rectángulo del cuadro
    doc.rect(x, y, columnWidth, boxHeight).stroke();

    // Dibujar la foto del ciudadano (simulada aquí como un rectángulo)
    //doc.rect(x + 30, y + 10, 50, 50).stroke(); // Simula la posición de la foto

    // Lista de detalles del ciudadano
    const detailsYStart = y + 3;
    const detailsXStart = x + 75;
    const detailsWidth = columnWidth - 90;

    doc.fontSize(10).lineGap(1);

    let currentY = doc.y + 5;
    
    doc.image(citizen.photo, x + 3, y + 3, {width: 70, height: 90});
    doc.fontSize(8).font('Helvetica-Bold').text(`${citizen.firstName} ${citizen.lastName}`, detailsXStart, detailsYStart, { width: detailsWidth });
    currentY = doc.y;
    doc.fontSize(8).font('Helvetica').text(`${citizen.citizenID}`, detailsXStart, currentY, { width: detailsWidth });
    currentY = doc.y;
    doc.text(`Dir: ${citizen.address}`, detailsXStart, currentY, { width: detailsWidth });
    currentY = doc.y;
    doc.text(`Tel: ${citizen.phone}`, detailsXStart, currentY, { width: detailsWidth });
    currentY = doc.y;
    doc.text(`Mesa: ${citizen.college}`, detailsXStart, currentY, { width: detailsWidth });
    currentY = doc.y;
    doc.text(citizen.precint, detailsXStart, currentY, { width: detailsWidth });
}

drawHeader(doc,currentPage, totalPages, user, citizens.length);


// Dibujar los cuadros de los ciudadanos en columnas
citizens.forEach((citizen, index) => {
    const position = index % citizensPerPage;
    
    if (index > 0 && position === 0) {
        doc.addPage();
        drawHeader(doc,currentPage, totalPages, user, citizens.length);    
    }
    const column = position % 3;
    const x = startX + (column * (columnWidth + columnSpacing));
    const row = Math.floor(position / 3);
    const y = startY + (row * (boxHeight + columnSpacing));

    drawCitizenBox(citizen, x, y);

    if (position === 14) {
        drawFooter(doc, currentPage, totalPages, x, y)
        currentPage++ 
    }
});


drawFooter(doc, currentPage, totalPages, 400, 580)
    // Finalizar el documento
    
    doc.addPage(); // Comienza una nueva página para los vínculos
drawTiesHeader(doc, 1, 1); 
    // Dibujar los cuadros de los ciudadanos en columnas
vinculos.forEach((citizen, index) => {
    const position = index % citizensPerPage;
    
    if (index > 0 && position === 0) {
        doc.addPage();
        drawHeader(doc,currentPage, totalPages, user, citizens.length);    
    }
    const column = position % 3;
    const x = startX + (column * (columnWidth + columnSpacing));
    const row = Math.floor(position / 3);
    const y = startY + (row * (boxHeight + columnSpacing));

    drawTieBox(citizen, x, y);

    if (position === 14) {
        drawFooter(doc, currentPage, totalPages, x, y)
        currentPage++ 
    }
});


    doc.end();

   
return pdfName
} catch (error) {
    console.error(error);
}
}

//dibujando encabezado
function drawFooter(doc, currentPage, totalPages, x, y){
doc.text(`Página  ${currentPage} de ${totalPages}`, x - 100 , y+130);
}
function drawHeader(doc, currentPage, totalPages, user, total) {

    const pageWidth = doc.page.width;
    const marginRight =100; // Margen derecho de 50 puntos
    const marginTop = 50; // Margen superior de 50 puntos
    let headerXStart = 20;
    let headerYStart = 10;
    let logo = path.resolve( __dirname, `../../uploads/images/system/MIELECTOR.PNG`) 
    
    doc.fontSize(10).text(fecha, pageWidth - marginRight - doc.widthOfString(fecha), marginTop, {
        align: 'right'
    });
    doc.image(logo, headerXStart, headerYStart-5, {width: 60, height: 70});
    doc.link(headerXStart, headerYStart-5, 60, 70, 'https://mielector.com/');
    doc.fontSize(25).font('Helvetica-Bold').lineGap(-10).text(`Mi Elector`, headerXStart + 60, headerYStart + 25, { width: 100 });
    doc.fontSize(10).font('Helvetica').text(`Sistema de Gestión Electoral`, headerXStart, headerYStart+67);

    doc.fontSize(10).font('Helvetica').text(user[0]?.user_role?.roleName, headerXStart, headerYStart+80);
    doc.fontSize(10).font('Helvetica-Bold').text(`${user[0]?.censu?.firstName} ${user[0]?.censu?.lastName}`, headerXStart, headerYStart + 90, { width: 200 });
    doc.fontSize(10).font('Helvetica').text(`Celular: ${user[0]?.censu.celphone}`, headerXStart, headerYStart+105);
    
    //columna del medio del encabezado 
    doc.text(`Página  ${currentPage} de ${totalPages}`, headerXStart + 200 , headerYStart + 65);
    doc.fontSize(10).font('Helvetica').text(`Usuario`, headerXStart + 200, headerYStart+80);
    doc.fontSize(10).font('Helvetica-Bold').text(`${user[0]?.email}`, headerXStart + 200, headerYStart + 90, { width: 200 });
    doc.fontSize(10).font('Helvetica').text(user[0]?.active?'Activo':'Desactivado', headerXStart + 200, headerYStart + 105);
    
    
    //tercera columna del encabezado
    doc.fontSize(10).font('Helvetica').text(`Asignados`, headerXStart + 380, headerYStart + 80);
    doc.fontSize(10).font('Helvetica-Bold').text(total, headerXStart + 380, headerYStart + 90, { width: 200 });
   
    }

    function drawTiesHeader(doc, currentPage, totalPages) {
        // Puedes ajustar este encabezado como prefieras
        const pageWidth = doc.page.width;
        const marginTop = 50; // Margen superior de 50 puntos
        let headerXStart = 20;
        let headerYStart = 10;
        let logo = path.resolve( __dirname, `../../uploads/images/system/MIELECTOR.PNG`) 
    
        doc.fontSize(16).text("Vínculos y Conexiones", headerXStart, headerYStart, {
            align: 'center'
        });

    doc.image(logo, headerXStart, headerYStart-5, {width: 60, height: 70});
    doc.link(headerXStart, headerYStart-5, 60, 70, 'https://mielector.com/');
    doc.fontSize(25).font('Helvetica-Bold').lineGap(-10).text(`Mi Elector`, headerXStart + 60, headerYStart + 25, { width: 100 });
    doc.fontSize(10).font('Helvetica').text(`Sistema de Gestión Electoral`, headerXStart, headerYStart+67);
    
        // Agrega aquí más elementos al encabezado si es necesario
    }
module.exports = {
    padroncilloPdf
}