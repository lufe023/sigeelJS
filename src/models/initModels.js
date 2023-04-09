const Roles = require('./roles.models')
const Users = require('./users.models')
const Gps = require('./gps.models')
const Poll = require('./poll.models')
const Benefit = require('./benefit.models')
const Participation = require('./participation.models')
const Job = require('./job.models')
const Census = require('./census.models')
const Maps = require('./maps.models')
const Todo = require('./todo.models')
const Ballots = require('./ballot.models')


const initModels = () => {
    //? hasMany || hasOne llave foranea dentro de parentesis
    //? belongsTo || belongsToMany llave foranea en primer paramentro
    //user.hasOne(models.role, {foreignKey: 'id',sourceKey: 'roleId'})
    
    Census.hasOne(Maps, {foreignKey: 'id',sourceKey: 'province', as: 'provinces'})
    Census.hasOne(Maps, {foreignKey: 'id',sourceKey: 'municipality', as: 'municipalities'})
    Census.hasOne(Maps, {foreignKey: 'id',sourceKey: 'district', as: 'districts'})
    Census.hasOne(Maps, {foreignKey: 'id',sourceKey: 'neighbourhood', as: 'neighbourhoods'})
    
    //relacionando la tabla usuario para obtener la informacion del lider que tiene a cargo la persona
    Census.hasOne(Users, {foreignKey: 'id',sourceKey: 'leader', as: 'leaders'})
    
    Users.belongsTo(Census)
    
    Users.belongsTo(Roles)
    //Users.hasOne(Roles, {foreignKey: 'id',sourceKey: 'role', as: 'nivel'})
    
    //relacionando la tabla beneficios para obtener la informacion de beneficios que ha obtenido la persona
    Census.hasMany(Benefit, {foreignKey:'citicenID' , sourceKey: 'citizenID', as: 'Beneficios'})


    //relacionando la tabla jobs para obtener la informacion de empleo que ha obtenido la persona, tambien esto nos da un poco de luz de la fidelidad partidaria de cada personas.
    Census.hasMany(Job, {foreignKey:'citicenID' , sourceKey: 'citizenID', as: 'Empleos'})

    //relacionando la tabla participations para obtener la informacion de en que actividades la persona ha estado activa, tambien esto nos da un poco de luz de la fidelidad partidaria de cada personas.
    Census.hasMany(Participation, {foreignKey:'citicenID' , sourceKey: 'citizenID', as: 'Actividades'})

    //relacionando la tabla participations para obtener la informacion de en que actividades la persona ha estado activa, tambien esto nos da un poco de luz de la fidelidad partidaria de cada personas.
    Census.hasOne(Gps, {foreignKey:'citicenID' , sourceKey: 'citizenID', as: 'geolocation'})

    //relacionando la tabla participations para obtener la informacion de en que actividades la persona ha estado activa, tambien esto nos da un poco de luz de la fidelidad partidaria de cada personas.
    Census.hasMany(Poll, {foreignKey:'citizenID' , sourceKey: 'citizenID', as: 'Encuestas'})

    Todo.hasOne(Users, {foreignKey:'id' , sourceKey: 'responsible', as: 'Responsible'})
    Todo.hasOne(Users, {foreignKey:'id' , sourceKey: 'createdBy', as: 'Creador'})

    //union de la tabla que guarda la boleta con el mapa
    
    Ballots.hasMany(Maps, {foreignKey: 'id',sourceKey: 'distritoMunicipal', as: 'DistritoMunicipal'})
    Ballots.hasMany(Maps, {foreignKey: 'id',sourceKey: 'municipio', as: 'municipality'})
    Ballots.hasMany(Maps, {foreignKey: 'id',sourceKey: 'provincia', as: 'province'})
    
}


module.exports = initModels