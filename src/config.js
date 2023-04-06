//? Dependencies
require('dotenv').config()

const config = {
    port: process.env.PORT || 8000,
    nodeEnv: process.env.NODE_ENV || 'development', //? Desarrollo, Testing, Produccion
    jwtSecret: process.env.JWT_SECRET,
    host: process.env.HOST || 'localhost:9000',
    db: {
        host: process.env.DB_HOST || 'localhost',
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASS,
        dbName: process.env.DB_NAME || 'sigellB'
    }

}
module.exports = config