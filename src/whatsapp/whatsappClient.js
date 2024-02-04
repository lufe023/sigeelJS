const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const {deleteQrImage} = require('../images/images.controller')
const CensusController = require('../census/census.controller')
const path = require('path')
const fs = require('fs-extra')

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
            `🏛️  Colegio: ${colegio.collegeNumber || 'No especificado'}\n` +
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
                await message.reply("Esta opción se encuentra en desarrollo y aún no esta disponible)");
                chatStates[chatId].stage = 0; // Regresa al estado inicial

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

        // Agrega más casos según sea necesario
    }
});

client.initialize();

module.exports = client;