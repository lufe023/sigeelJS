const router = require('express').Router()
const censusServices = require('./census.services')

router.get('/', censusServices.getAllCensus)

module.exports = router

