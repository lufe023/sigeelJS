//? Dependencies
const express = require('express');
const db = require('./utils/database')

//? Files
const {port} = require('./config');
//* Routes
const userRouter = require('./users/users.router')
const authRouter = require('./auth/auth.router')
const censusRouter = require('./census/census.router')
const todoRouter = require('./todo/todo.router')

const initModels = require('./models/initModels')

//? Initial Configurations
const app = express()

app.use(express.json())

db.authenticate()
    .then(() => {
        console.log('Database Authenticated')
    })
    .catch(err => {
        console.log(err)
    })

db.sync()
    .then(() => {
        console.log('Database Synced')
    })
    .catch(err => {
        console.log(err)
    })

initModels()


app.get('/',(req, res) => {
    res.status(200).json({
        message: 'OK!',
        users: `localhost:${port}/api/v1/users`
    })
})

app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/census', censusRouter)
app.use('/api/v1/todo', todoRouter)

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})

