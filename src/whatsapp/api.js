const {Client, LocalAuth} = require("whatsapp-web.js")
const qrcode = require('qrcode-terminal')

async function startAPI() {
    const client = new Client({
        authStrategy: new LocalAuth()
    })

    client.on('qr', (qr)=> {
        qrcode.generate(qr, {small: true})
        console.log('Generando QR')
    })

    client.on('ready', ()=> {
        console.log('Client is Ready!')
    })

    await client.initialize()

    return client
}

module.exports = startAPI