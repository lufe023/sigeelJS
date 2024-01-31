const client = require('./whatsappClient');

client.on('message', async message => {
    if (message.body === '!ping') {
		await message.reply('pong');
	}
    console.log(message.body); // Aquí puedes procesar el mensaje como desees.
    // Por ejemplo, puedes enviar una respuesta automática, registrar el mensaje en una base de datos, etc.
});