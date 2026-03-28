const Roles = require("./roles.models");
const Users = require("./users.models");
const Gps = require("./gps.models");
const Poll = require("./poll.models");
const Benefit = require("./benefit.models");
const Participation = require("./participation.models");
const Job = require("./job.models");
const Census = require("./census.models");
const Ciudadseccion = require("./ciudadseccion.model");
const Municipios = require("./municipio.models");
const Provincia = require("./provincia.models");
const SectorParaje = require("./sectorParaje.model");
const Todo = require("./todo.models");
const Ballots = require("./ballot.models");
const Campain = require("./campain.models");
const Parties = require("./parties.models");
const Teams = require("./teams.models");
const TeamsMembers = require("./teamsMembers.models");
const Condition = require("./condition.models");
const Suffrage = require("./suffrage.models");
const Ties = require("./ties.models");
const TiesTypes = require("./tiesTypes.models");
const Precincts = require("./precinct.models");
const College = require("./college.models");
const Audit = require("./audit.models");
const Banners = require("./banner.model");
const UsuarioMunicipio = require("./usuarioMunicipio.model");
const UsuarioSectorParaje = require("./usuarioSectorParaje.models");
const { Op } = require("sequelize");

const initModels = () => {
    // --- CENSUS ---
    Census.hasOne(Provincia, {
        foreignKey: "ProvinciaId",
        sourceKey: "province",
        as: "provinces",
    });
    Census.hasOne(Municipios, {
        foreignKey: "MunicipalityId",
        sourceKey: "municipality",
        as: "municipalities",
    });
    Census.hasOne(SectorParaje, {
        foreignKey: "SectorParajeId",
        sourceKey: "IDSectorParaje",
        as: "sector",
    });
    Census.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "leader",
        as: "leaders",
    });
    Census.hasOne(Condition, {
        foreignKey: "citizenID",
        sourceKey: "citizenID",
        as: "condition",
    });
    Census.hasOne(Users, {
        foreignKey: "censuCitizenID",
        sourceKey: "citizenID",
        as: "colaborador",
    });
    Census.hasOne(Gps, {
        foreignKey: "citicenID",
        sourceKey: "citizenID",
        as: "geolocation",
    });
    Census.hasOne(Suffrage, {
        foreignKey: "citizenID",
        sourceKey: "citizenID",
        as: "sufragio",
    });
    Census.hasMany(Benefit, {
        foreignKey: "citicenID",
        sourceKey: "citizenID",
        as: "Beneficios",
    });
    Census.hasMany(Job, {
        foreignKey: "citicenID",
        sourceKey: "citizenID",
        as: "Empleos",
    });
    Census.hasMany(Participation, {
        foreignKey: "citicenID",
        sourceKey: "citizenID",
        as: "Actividades",
    });
    Census.hasMany(Poll, {
        foreignKey: "citizenID",
        sourceKey: "citizenID",
        as: "Encuestas",
    });
    Census.belongsTo(College, { foreignKey: "CollegeId", as: "colegio" });

    // --- USERS & ROLES ---
    Users.belongsTo(Census);
    Users.belongsTo(Roles);
    Users.hasMany(Todo, {
        foreignKey: "responsible",
        sourceKey: "id",
        as: "tasks",
    });

    // --- POLLS & CAMPAIGNS ---
    Poll.hasOne(Census, {
        foreignKey: "citizenID",
        sourceKey: "citizenID",
        as: "citizen",
    });
    Poll.hasOne(Campain, {
        foreignKey: "id",
        sourceKey: "campain",
        as: "Campain",
    });
    Campain.hasMany(Poll, {
        foreignKey: "campain",
        sourceKey: "id",
        as: "encuestas",
    });

    // Poll Candidate Details
    Poll.hasMany(Parties, {
        foreignKey: "id",
        sourceKey: "preferedParty",
        as: "preferedPartyDetails",
    });
    Poll.hasMany(Ballots, {
        foreignKey: "candidateId",
        sourceKey: "president",
        as: "preferedPresidentDetails",
    });
    Poll.hasMany(Ballots, {
        foreignKey: "candidateId",
        sourceKey: "senator",
        as: "preferedSenatorDetails",
    });
    Poll.hasMany(Ballots, {
        foreignKey: "candidateId",
        sourceKey: "diputy",
        as: "preferedDiputyDetails",
    });
    Poll.hasMany(Ballots, {
        foreignKey: "candidateId",
        sourceKey: "mayor",
        as: "preferedMayorDetails",
    });
    Poll.hasMany(Ballots, {
        foreignKey: "candidateId",
        sourceKey: "councillor",
        as: "preferedCouncillorDetails",
    });
    Poll.hasMany(Ballots, {
        foreignKey: "candidateId",
        sourceKey: "districtDirector",
        as: "preferedDistrictDirectorDetails",
    });
    Poll.hasMany(Ballots, {
        foreignKey: "candidateId",
        sourceKey: "districtCouncilor",
        as: "preferedDistrictCouncilorDetails",
    });

    // --- BALLOTS & PARTIES ---
    Ballots.hasOne(Parties, {
        foreignKey: "id",
        sourceKey: "party",
        as: "partyDetails",
    });
    Ballots.hasMany(Ciudadseccion, {
        foreignKey: "CiudadseccionId",
        sourceKey: "ciudadSeccion",
        as: "DistritoMunicipal",
    });
    Ballots.hasMany(Municipios, {
        foreignKey: "MunicipalityId",
        sourceKey: "municipio",
        as: "municipality",
    });
    Ballots.hasMany(Provincia, {
        foreignKey: "ProvinciaId",
        sourceKey: "provincia",
        as: "province",
    });

    // --- TIES ---
    Ties.hasOne(Census, {
        foreignKey: "citizenID",
        sourceKey: "aCiticenID",
        as: "aties",
    });
    Ties.hasOne(Census, {
        foreignKey: "citizenID",
        sourceKey: "bCiticenID",
        as: "bties",
    });
    Ties.hasOne(TiesTypes, {
        foreignKey: "id",
        sourceKey: "ties",
        as: "tieType",
    });

    // --- TEAMS ---
    TeamsMembers.hasOne(Teams, {
        foreignKey: "id",
        sourceKey: "teamId",
        as: "team",
    });
    Teams.hasMany(TeamsMembers, {
        foreignKey: "teamId",
        sourceKey: "id",
        as: "members",
    });
    Teams.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "createdBy",
        as: "woner",
    });
    TeamsMembers.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "memberId",
        as: "memberData",
    });

    // --- GEOGRAPHY & PRECINCTS ---
    Gps.hasOne(Census, {
        foreignKey: "citizenID",
        sourceKey: "citicenID",
        as: "citizen",
    });
    Precincts.hasOne(SectorParaje, {
        foreignKey: "SectorParajeId",
        sourceKey: "IDSectorParaje",
        as: "PrecinctsSectorParaje",
    });
    Precincts.hasMany(College, {
        foreignKey: "PrecinctId",
        sourceKey: "PrecinctId",
        as: "colegios",
    });
    College.hasMany(Census, {
        foreignKey: "CollegeId",
        sourceKey: "CollegeId",
        as: "ColegioCensus",
    });
    College.belongsTo(Precincts, {
        foreignKey: "PrecinctId",
        as: "precinctData",
    });

    // --- TODO & CAMPAIGN MAPS ---
    Todo.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "responsible",
        as: "Responsible",
    });
    Todo.hasOne(Users, {
        foreignKey: "id",
        sourceKey: "createdBy",
        as: "Creador",
    });
    Campain.hasOne(Provincia, {
        foreignKey: "ProvinciaId",
        sourceKey: "provincia",
        as: "provinces",
    });
    Campain.hasOne(Municipios, {
        foreignKey: "MunicipalityId",
        sourceKey: "municipio",
        as: "municipalities",
    });

    // --- MANY TO MANY: USUARIO & MUNICIPIO ---
    Users.belongsToMany(Municipios, {
        through: UsuarioMunicipio,
        foreignKey: "idusuario",
        otherKey: "idmunicipio",
        as: "municipios",
    });
    Municipios.belongsToMany(Users, {
        through: UsuarioMunicipio,
        foreignKey: "idmunicipio",
        otherKey: "idusuario",
        as: "usuarios",
    });
    UsuarioMunicipio.belongsTo(Users, {
        foreignKey: "idusuario",
        as: "usuario",
    });
    UsuarioMunicipio.belongsTo(Municipios, {
        foreignKey: "idmunicipio",
        as: "municipio",
    });
    Users.hasMany(UsuarioMunicipio, {
        foreignKey: "idusuario",
        as: "usuario_municipios",
    });
    Municipios.hasMany(UsuarioMunicipio, {
        foreignKey: "idmunicipio",
        as: "usuario_municipios",
    });

    // --- JERARQUÍA TERRITORIAL FINAL (UNICA VEZ) ---
    SectorParaje.belongsTo(Ciudadseccion, {
        foreignKey: "IDCiudadSeccion",
        as: "ciudadseccion",
    });
    Ciudadseccion.belongsTo(Municipios, {
        foreignKey: "idmunicipio",
        as: "municipio",
    });
    Municipios.belongsTo(Provincia, {
        foreignKey: "ProvinciaId",
        as: "provincia",
    });

    Provincia.hasMany(Municipios, {
        foreignKey: "ProvinciaId",
        as: "municipios_detalles",
    });
    Municipios.hasMany(Ciudadseccion, {
        foreignKey: "idmunicipio",
        as: "ciudades_secciones",
    });
    Ciudadseccion.hasMany(SectorParaje, {
        foreignKey: "IDCiudadSeccion",
        as: "sectores",
    });

    // --- ASIGNACIÓN DE SECTORES (UNICA VEZ) ---
    Users.belongsToMany(SectorParaje, {
        through: UsuarioSectorParaje,
        foreignKey: "idusuario",
        otherKey: "idsectorparaje",
        as: "sectores_asignados",
    });
    SectorParaje.belongsToMany(Users, {
        through: UsuarioSectorParaje,
        foreignKey: "idsectorparaje",
        otherKey: "idusuario",
        as: "usuarios_sector_directo",
    });

    UsuarioSectorParaje.belongsTo(SectorParaje, {
        foreignKey: "idsectorparaje",
        as: "sector_paraje",
    });
    UsuarioSectorParaje.belongsTo(Users, {
        foreignKey: "idusuario",
        as: "usuario",
    });
    SectorParaje.hasMany(UsuarioSectorParaje, {
        foreignKey: "idsectorparaje",
        as: "asignaciones_intermedias",
    });

    // --- PRECINCTS RELATIONSHIPS ---
    Precincts.belongsTo(SectorParaje, {
        foreignKey: "IDSectorParaje",
        targetKey: "SectorParajeId",
        as: "sectorParaje",
    });

    SectorParaje.belongsTo(Ciudadseccion, {
        foreignKey: "IDCiudadSeccion",
        targetKey: "CiudadseccionId",
        as: "ciudadSeccion",
    });

    // Dentro de initModels en tu archivo de asociaciones:
College.belongsTo(Municipios, { foreignKey: "MunicipalityId", as: "municipio" });
};

module.exports = initModels;
