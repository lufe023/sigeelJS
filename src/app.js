const express = require('express');
const cors = require('cors');
const { port } = require('./config');
const db = require('./utils/database');
const initModels = require('./models/initModels');
const bodyParser = require('body-parser');

//* Routes
const userRouter = require('./users/users.router')
const authRouter = require('./auth/auth.router')
const censusRouter = require('./census/census.router')
const todoRouter = require('./todo/todo.router')
const ballotsRouter = require('./ballots/ballots.router')
const mapsRouter = require('./maps/maps.router')
const pollsRouter = require('./polls/polls.router')
const imageRouter = require('./images/images.router')
const dashboard = require('./dashboard/dashboard.router')
const teamsRouter = require('./teams/teams.router')
const inTouchRouter = require('./inTouch/inTouch.router')
const ties = require('./ties/ties.router')
const gpsRouter = require('./gps/gps.router')
const jceRouter = require('./jce/jce.router')
const campain = require('./campain/campain.router')
const reports = require('./reports/reports.router')
const suffrage = require('./suffrage/suffrage.router')
const whatsapp = require('./whatsapp/whatsapp.router')

//? Initial Configurations
const app = express()

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

app.use(cors())
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

//path of routes
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/census', censusRouter)
app.use('/api/v1/todo', todoRouter)
app.use('/api/v1/ballots', ballotsRouter)
app.use('/api/v1/maps', mapsRouter)
app.use('/api/v1/polls', pollsRouter)
app.use('/api/v1/images', imageRouter);
app.use('/api/v1/dashboard', dashboard)
app.use('/api/v1/teams', teamsRouter)
app.use('/api/v1/intouch', inTouchRouter)
app.use('/api/v1/ties', ties)
app.use('/api/v1/gps', gpsRouter)
app.use('/api/v1/jce', jceRouter)
app.use('/api/v1/campains', campain)
app.use('/api/v1/reports', reports)
app.use('/api/v1/suffrages', suffrage)
app.use('/api/v1/whatsapp', whatsapp)

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})