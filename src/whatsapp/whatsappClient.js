const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const {deleteQrImage} = require('../images/images.controller')
const CensusController = require('../census/census.controller')
const path = require('path')
const fs = require('fs-extra')
const usersControllers = require('../users/users.controllers')
const padron = require('../pdfCreator/padronToPdf')
const borrardeleteOldPdfs = require('../pdfCreator/cleanUpOldPdfs')
const estado = [{
    cedula: '',
    fecha: ''
}]


const convertBirthDay = (fechaStr) =>{


// Convertir a objeto de fecha
const fechaObj = new Date(fechaStr);

// Extraer día, mes y año
const dia = fechaObj.getDate(); // Día del mes
const mes = fechaObj.getMonth() + 1; // Mes (0-11, por eso sumamos 1)
const año = fechaObj.getFullYear(); // Año

// Asegurar formato DDMMYYYY
const fechaFormateada = `${dia.toString().padStart(2, '0')}${mes.toString().padStart(2, '0')}${año}`;
return fechaFormateada
}

function formatarRespuesta(data) {
    if (!data || !data.rows || data.rows.length === 0) {
        return 'No se encontraron datos.';
    }

    const persona = data.rows[0].dataValues;
    const colegio = persona.colegio ? persona.colegio.dataValues : {};
    const lider = persona.leaders ? persona.leaders.dataValues : {};
    const voto = persona?.sufragio?.suffrage ? persona.sufragio = 'Votó' : 'No ha votado'

    return  `👤 Nombre: ${persona.firstName} ${persona.lastName}\n` +
            `😉 Apodo: ${persona.nickname || 'No especificado'}\n` +
            `📱 Celular: ${persona.celphone || 'No especificado'}\n` +
            `🗒️ Posición: ${persona.position || 'No especificado'}\n` +
            `🏛️ Colegio: ${colegio.collegeNumber || 'No especificado'}\n` +
            `🏫 Recinto: ${colegio.precinctData.recintoNombre || 'No especificado'}\n` +
            `🏠 Dirección: ${persona.adress || 'No especificada'}\n`+
            `🗳️ *${voto}*\n`+
            `🦸 Lider: ${lider?.censu?.firstName || ' No especificado'}\n`;
           // Agrega más campos según necesites
}

function formatearImagen(data) {
    if (!data || !data.rows || data.rows.length === 0) {
        return 'No se encontraron datos.';
    }
    const persona = data.rows[0].dataValues;
    return persona.picture
           // Agrega más campos según necesites
}

const generateQRImage = async (text, filePath) => {
    try {
        await qrcode.toFile(filePath, text);
        return true;
    } catch (error) {
        console.error('Error al generar el archivo de código QR:', error);
        return false;
    }
};

const client = new Client({
    authStrategy: new LocalAuth() // Usando LocalAuth para la autenticación
});

client.on('qr', qr => {
    const qrFilePath = path.join(__dirname, './qr/qr.png');
    generateQRImage(qr, qrFilePath).then((success) => {
        if (success) {
            console.log('Código QR guardado en:', qrFilePath);
        } else {
            console.log('Error al guardar el código QR');
        }
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
    deleteQrImage('../whatsapp/qr','qr.png')

});

// Listener de mensajes
const chatStates = {};

client.on('message', async message => {
    const chatId = message.from;
    const msgText = message.body;

    // Inicializa el estado del chat si no existe
    if (!chatStates[chatId]) {
        chatStates[chatId] = { stage: 0 };
    }

    // Manejo del flujo de conversación
    switch (chatStates[chatId].stage) {
        case 0:
            if (msgText.toLowerCase() != null) {
                await message.reply("Saludos, soy el bot de MiElector y estoy aquí para ayudarte. 🤖\nElige un número de esta lista:\n\n" +
                "1️⃣ Consultar Cédula.\n" +
                "2️⃣ Recibir mi Padroncillo.");
                chatStates[chatId].stage = 1; // Avanza al siguiente estado
            }
            break;

        case 1:
            if (msgText === '1') {
                await message.reply("Indíqueme el número de cédula, por favor.");
                chatStates[chatId].stage = 2; // Avanza al estado de consulta de cédula
            } else if (msgText === '2') {
                // Aquí manejas la lógica para el Padroncillo
                await message.reply("Indíqueme el número de cédula, por favor.");
                chatStates[chatId].stage = 3; // avanza a caso 3
            }
            break;

        case 2:
            // Aquí manejas la lógica para buscar la cédula en la base de datos
            // Por ejemplo, puedes hacer una consulta a tu base de datos aquí
            //const respuestaDB = "Resultado de la DB para la cédula " + msgText;
            const respuestaDB = await CensusController.findPeople(msgText)
            const mensaje = await formatarRespuesta(respuestaDB);
            await message.reply(mensaje);
            const nombreImagen = await formatearImagen(respuestaDB)
            if(nombreImagen){
                const imagePath = path.resolve( __dirname, `../../uploads/images/citizens/${nombreImagen}`);
                if (await fs.existsSync(imagePath)) {
                    const imageMedia = MessageMedia.fromFilePath(imagePath);
                    await client.sendMessage(message.from, imageMedia);
                } 
            }
            chatStates[chatId].stage = 0; // Regresa al estado inicial
            break;
            
            case 3:
                
                let cedula = msgText.trim().replace(/-/g, "");
                if (cedula.length===11) {
                    estado.cedula = cedula
                    await message.reply("Indíqueme la fecha de nacimiento en el formato día, mes y año ejemplo: 20-01-1978");
                    chatStates[chatId].stage = 4; // Avanza al estado de consulta de cédula
                } 
                break;

            case 4:
                let fecha = msgText.trim().replace(/-/g, "");
                fecha = fecha.replace(/\//g, "");
            if (fecha.length===8) {
                const padroncillo = await usersControllers.findUserController(estado.cedula)
                const birthDay = await CensusController.citizenBirthDay(estado.cedula)
                const nacimiento = convertBirthDay(birthDay)
                if (nacimiento === fecha) {
                    // Genera el PDF
                    await padron.padroncilloPdf(padroncillo.rows[0].colaborador.id, message.from, estado.cedula)
                    // .then()
                    .then((pdfName) => {
                    let pdfPath = path.resolve(__dirname, '../pdfCreator/', pdfName);
                    //let pdfMedia = MessageMedia.fromFilePath(pdfPath);
                    const fileContent = fs.readFileSync(pdfPath)
                    let pdfMedia = new MessageMedia('application/pdf', fileContent.toString('base64'), pdfPath);
                    const sendPDFToWhatsApp = async (client, recipientNumber, pdfFilePath) => {
                        // Verifica si el archivo existe antes de intentar enviarlo
                        if (fs.existsSync(pdfFilePath)) {
                            // Obtiene solo el nombre del archivo, sin la ruta
                            const filename = path.basename(pdfFilePath);
                            
                            // Crea una instancia de MessageMedia desde el archivo PDF
                            const pdfMedia = MessageMedia.fromFilePath(pdfFilePath);
                            
                            // Envía el archivo PDF al número de destino con una leyenda
                            await client.sendMessage(recipientNumber, pdfMedia, { caption: "Aquí está su padroncillo." })
                            .then(() => 
                            borrardeleteOldPdfs.cleanUpOldPdfs(estado.cedula)
                            )
                            console.log("PDF enviado con éxito.");
                        } else {
                            console.log("El archivo PDF no se encontró.");
                        }
                    };
                    setTimeout(() => {

                    sendPDFToWhatsApp(client, message.from, pdfPath);
                        
                    }, 3000); // 10000 milisegundos = 10 segundos
                })
                .catch((err) => { console.log(err); });
                } else {
                    await message.reply("Esta fecha de nacimiento no coincide con: " + padroncillo.rows[0].firstName + " " + padroncillo.rows[0].lastName);
                }
                
                chatStates[chatId].stage = 0;
                }
            break;
            
            
                
            }  
})

client.initialize();

module.exports = client