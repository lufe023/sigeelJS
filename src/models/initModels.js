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
const Campain = require('./campain.models')
const Parties = require('./parties.models')
const Teams = require('./teams.models')
const TeamsMembers = require('./teamsMembers.models')
const Condition = require('./condition.models')
const Suffrage = require('./suffrage.models')
const Ties = require('./ties.models')
const tiesTypes = require('./tiesTypes.models') 
const TiesTypes = require('./tiesTypes.models')
const Precincts = require('./precinct.models')
const College = require('./college.models')
const Audit =require('./audit.models')
const Banners = require('./banner.model')
const {Op} = require("sequelize")
const teamsMembers = require('./teamsMembers.models')

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

     //relacionando la tabla Condition para obtener la informacion de la condicion especial de cada ciudadano
    Census.hasOne(Condition, {foreignKey: 'citizenID',sourceKey: 'citizenID', as: 'condition'})
    

    Census.hasOne(Users, {foreignKey: 'censuCitizenID',sourceKey: 'citizenID', as: 'colaborador'})

    Users

    Users.belongsTo(Census)


    
    //relacionar los candidatos con los partidos
    Ballots.hasOne(Parties, {foreignKey: 'id',sourceKey: 'party', as: 'partyDetails'} )
    
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
    
    //llamando un ciudadano por su encuesta
    Poll.hasOne(Census,  {foreignKey:'citizenID' , sourceKey: 'citizenID', as: 'citizen'})

    //relacionando la tabla ties (los vinculos)
    //Census.hasMany(Ties, {foreignKey: 'aCiticenID', sourceKey: 'citizenID', as: 'ties'})



    //relacionando la tabla TIes con ties Types
    Ties.hasOne(Census, {foreignKey: 'citizenID', sourceKey: 'aCiticenID', as: 'aties'})
    Ties.hasOne(Census, {foreignKey: 'citizenID', sourceKey: 'bCiticenID', as: 'bties'})

    Ties.hasOne(TiesTypes, {foreignKey: 'id', sourceKey: 'ties', as: 'tieType'})

    //relacion encuesta y campaña cada encuesta puede tener una campaña
    Poll.hasOne(Campain,  {foreignKey:'id' , sourceKey: 'campain', as: 'Campain'})
    Campain.hasMany(Poll, {foreignKey:'campain', sourceKey:'id', as: 'encuestas'})
    
/* ###### Inicio ligando tareas a usuarios ####*/

Users.hasMany(Todo, {foreignKey:'responsible', sourceKey:'id', as: 'tasks'})
//Todo.hasOne(Users, {foreignKey: 'id', sourceKey: 'responsible', as: 'tasks'})
 /* ########################## // Fin ligando tareas a usuarios */
//Users.hasMany(Todo)


/* ############################# //Inicio conectando lista de Candidatos con las encuestas */
        //conectando lista de partidos con las encuestas
        Poll.hasMany(Parties, {foreignKey:'id' , sourceKey: 'preferedParty', as: 'preferedPartyDetails'})

        //conectando lista de Presidentes con las encuestas
        Poll.hasMany(Ballots, {foreignKey:'candidateId' , sourceKey: 'president', as: 'preferedPresidentDetails'})

        //conectando lista de Senadores con las encuestas
        Poll.hasMany(Ballots, {foreignKey:'candidateId' , sourceKey: 'senator', as: 'preferedSenatorDetails'})

        //conectando lista de Diputados con las encuestas
        Poll.hasMany(Ballots, {foreignKey:'candidateId' , sourceKey: 'diputy', as: 'preferedDiputyDetails'})      
        
        //conectando lista de Alcaldes con las encuestas
        Poll.hasMany(Ballots, {foreignKey:'candidateId' , sourceKey: 'mayor', as: 'preferedMayorDetails'})   

        //conectando lista de Regidor con las encuestas
        Poll.hasMany(Ballots, {foreignKey:'candidateId' , sourceKey: 'councillor', as: 'preferedCouncillorDetails'})   

        //conectando lista de Director de Distrito con las encuestas
        Poll.hasMany(Ballots, {foreignKey:'candidateId' , sourceKey: 'districtDirector', as: 'preferedDistrictDirectorDetails'})

        //conectando lista de Vocal  de Distrito con las encuestas
        Poll.hasMany(Ballots, {foreignKey:'candidateId' , sourceKey: 'districtCouncilor', as: 'preferedDistrictCouncilorDetails'})        
 /* ########################## // Fin conectando lista de Candidatos con las encuestas */

    //Ballots.hasOne(Parties, {foreignKey:'id' , sourceKey: 'party', as: 'party_details'})

    //asociando el modelo campains con el modelo maps
    Campain.hasOne(Maps, {foreignKey: 'id',sourceKey: 'provincia', as: 'provinces'})
    Campain.hasOne(Maps, {foreignKey: 'id',sourceKey: 'municipio', as: 'municipalities'})
    Campain.hasOne(Maps, {foreignKey: 'id',sourceKey: 'distritoMunicipal', as: 'districts'})
    Campain.hasOne(Maps, {foreignKey: 'id',sourceKey: 'neighbourhood', as: 'neighbourhoods'})

    Todo.hasOne(Users, {foreignKey:'id' , sourceKey: 'responsible', as: 'Responsible'})
    Todo.hasOne(Users, {foreignKey:'id' , sourceKey: 'createdBy', as: 'Creador'})

    //union de la tabla que guarda la boleta con el mapa
    
    Ballots.hasMany(Maps, {foreignKey: 'id',sourceKey: 'distritoMunicipal', as: 'DistritoMunicipal'})
    Ballots.hasMany(Maps, {foreignKey: 'id',sourceKey: 'municipio', as: 'municipality'})
    Ballots.hasMany(Maps, {foreignKey: 'id',sourceKey: 'provincia', as: 'province'})
    
    /* #### relacionando los teams ### */

    //extrayendo los equipos cuando sellama un mienbro 
    TeamsMembers.hasOne(Teams, {foreignKey: 'id',sourceKey: 'teamId', as: 'team'})
    Teams.hasMany(TeamsMembers, {foreignKey: 'teamId',sourceKey: 'id', as: 'members'})
    Teams.hasOne(Users, {foreignKey: 'id', sourceKey: 'createdBy', as: 'woner'})
    TeamsMembers.hasOne(Users, {foreignKey: 'id',sourceKey: 'memberId', as: 'memberData'})

    //trayendo ciudadanos desde la tabla gps
    Gps.hasOne(Census,  {foreignKey: 'citizenID',sourceKey: 'citicenID', as: 'citizen'})


    //trayendo colegios junto a los recintos
    Precincts.hasMany(College,  {foreignKey: 'precinct',sourceKey: 'id', as: 'colegios'})

    Precincts.hasMany(Maps,  {foreignKey: 'id',sourceKey: 'provincia', as: 'PrecinctsProvincia'})
    Precincts.hasMany(Maps,  {foreignKey: 'id',sourceKey: 'municipio', as: 'PrecinctsMunicipio'})

    //trayendo colegios junto a los recintos
    Census.hasOne(College,  {foreignKey: 'id',sourceKey: 'college', as: 'colegio'})
    College.hasMany(Census,  {foreignKey: 'college',sourceKey: 'id', as: 'ColegioCensus'})
    College.belongsTo(Precincts, { foreignKey: 'precinct', as: 'precinctData' });
    //trayendo el recinto de cada colegio 
    College.hasOne(Precincts,  {foreignKey: 'id',sourceKey: 'precinct', as: 'recinto'})

    Census.hasOne(Suffrage,  {foreignKey: 'citizenID',sourceKey: 'citizenID', as: 'sufragio'})
}


module.exports = initModels