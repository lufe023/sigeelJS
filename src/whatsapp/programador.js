const cron = require('node-cron')
const {enviarMensaje} = require('./mensaje')

const CONTACTO = '18296858596@c.us'
const MSG_SALUDOS = [
    'Buenos dias, ¿Como amanecio?',
    'Buenos dias, ¿como esta?',
    'Buenos dias, ¿Como le va?'
]

function  programador_tareas (cliente){
    const tiempo = '0 28 23 * * * '
    if(cron.validate(tiempo)){
        console.log('Iniciando una tarea')
        cron.schedule(tiempo, async()=>{
            try{
                console.log('Cron entro al try')
                const saludo = MSG_SALUDOS[Math.floor(Math.random() * MSG_SALUDOS.length)]
                await enviarMensaje(cliente, CONTACTO, saludo)
                console.log('Mensaje enviado')
                console.log('Finalizó la tarea')
            }catch (error){
                console.log('Error en cron', error)
            }
        })
        
    }
}


module.exports = {programador_tareas}