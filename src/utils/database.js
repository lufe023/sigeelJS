const { Sequelize } = require('sequelize')
const config = require('../config')

const db = new Sequelize({
    dialect: 'postgres',
    host: config.db.host, //? Variable de entorno del host
    username: config.db.username, //? Variable de entorno del usuario
    password: config.db.password, //? Variable de entorno de la contraseña
    database: config.db.dbName, //? Variable de entorno de la base de datos
    dialectOptions: process.env.NODE_ENV === 'production'
    ?{
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {}
})

//para conectar en local
// const db = new Sequelize({
//     dialect: 'postgres',
//     host: 'localhost', //? Variable de entorno del host
//     username: 'postgres', //? Variable de entorno del usuario
//     password: 'MundoHolaqwsa023@', //? Variable de entorno de la contraseña
//     database: 'sigellB', //? Variable de entorno de la base de datos
//     dialectOptions: {
//                 ssl: false,
//                 rejectUnauthorized: false
//             }
// })


module.exports = db