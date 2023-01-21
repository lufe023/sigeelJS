const Roles = require('./roles.models')
const Users = require('./users.models')
const Ballot = require('./ballot.models')
const Precinct = require('./precinct.models')
const Gps = require('./gps.models')
const Poll = require('./poll.models')
const Benefit = require('./benefit.models')
const Participation = require('./participation.models')
const Job = require('./job.models')
const Census = require('./census.models')
const Provinces = require('./provinces.models')
const Municipalities = require('./municipalities.models')
const Neighbourhood = require('./neighbourhood.models')
const Districts = require('./district.models')
const Maps = require('./maps.models')

const initModels = () => {
    //? hasMany || hasOne llave foranea dentro de parentesis
    //? belongsTo || belongsToMany llave foranea en primer paramentro
    //user.hasOne(models.role, {foreignKey: 'id',sourceKey: 'roleId'})
    Census.hasMany(Maps, {foreignKey: 'id',sourceKey: 'province', as: 'provinces'})
    Census.hasMany(Maps, {foreignKey: 'id',sourceKey: 'municipality', as: 'municipalities'})
    Census.hasMany(Maps, {foreignKey: 'id',sourceKey: 'district', as: 'districts'})
    Census.hasMany(Maps, {foreignKey: 'id',sourceKey: 'neighbourhood', as: 'neighbourhoods'})
}


module.exports = initModels