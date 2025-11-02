const { DataTypes } = require("sequelize");
const db = require("../utils/database");

// Asumiendo que Municipality es el modelo para IDMunicipio
const Municipio = require("./municipio.models");
// Asumiendo que District es el modelo para IDDistritoMunicipal
// const District = require("./district.models");
// O si ambos apuntan a Maps:

const Ciudadseccion = db.define(
    "ciudadseccion",
    {
        // Clave Primaria (ID)
        CiudadseccionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: false,
            field: "CiudadseccionId",
        },

        // Clave Foránea a Municipio
        idmunicipio: {
            type: DataTypes.INTEGER, // Mapeo de smallint
            allowNull: false, // Unchecked = NOT NULL
            references: {
                model: Municipio, // o Municipality, según tu estructura
                key: "MunicipalityId", // O el nombre real de la PK en Municipio/Maps
            },
        },

        // Clave Foránea a Distrito Municipal
        iddistritomunicipal: {
            type: DataTypes.INTEGER, // Mapeo de smallint
            allowNull: true, // Checked = NULL
        },

        // Código de Ciudad/Barrio
        codigociudad: {
            type: DataTypes.STRING(2), // Mapeo de varchar(2)
            allowNull: true, // Checked = NULL
        },

        // Descripción
        descripcion: {
            type: DataTypes.STRING(50), // Mapeo de varchar(50)
            allowNull: true,
        },

        // Oficio
        oficio: {
            type: DataTypes.BIGINT, // Mapeo de bigint
            allowNull: true,
        },

        // Estatus
        estatus: {
            type: DataTypes.CHAR(1), // Mapeo de char(1)
            allowNull: true,
        },

        // IdUsuarioCreacion
        idusuariocreacion: {
            type: DataTypes.INTEGER, // Mapeo de int
            allowNull: true,
        },

        // FechaCreacion
        fechacreacion: {
            type: DataTypes.DATE, // Mapeo de smalldatetime
            allowNull: false, // Unchecked = NOT NULL
        },

        // IdUsuarioModificacion
        idusuariomodificacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // FechaModificacion
        fechamodificacion: {
            type: DataTypes.DATE, // Mapeo de smalldatetime
            allowNull: true,
        },

        // RegID (UUID de SQL Server)
        regid: {
            type: DataTypes.UUID, // Mapeo de uniqueidentifier
            allowNull: true,
        },
    },
    {
        tableName: "ciudadseccion",
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Ciudadseccion;
