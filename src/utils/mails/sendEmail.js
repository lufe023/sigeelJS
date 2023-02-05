const nodemailer = require("nodemailer")

enviarMail = async (from, mailReceiver, subject, text, html)=>{

    const config ={
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'lufe023@gmail.com',
            pass: 'eddemvoqvrfzsope'
        }
    }

    const mensaje= {
        from: 'no-reply@sigeel.com',
        to: mailReceiver,
        subject: subject,
        text: text,
        html:  html
    }
    const transport = nodemailer.createTransport(config)

    const info = await transport.sendMail(mensaje)

    return info
}

module.exports = {
    enviarMail
}
