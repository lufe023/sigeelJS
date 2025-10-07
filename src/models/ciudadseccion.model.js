const { DataTypes } = require("sequelize");
const db = require("../utils/database");

// Asumiendo que Municipality es el modelo para IDMunicipio
const Municipio = require("./municipio.models");
// Asumiendo que District es el modelo para IDDistritoMunicipal
// const District = require("./district.models");
// O si ambos apuntan a Maps:

const City = db.define(
    "ciudadseccion",
    {
        // Clave Primaria (ID)
        CiudadseccionId: {
            type: DataTypes.INTEGER, // Mapeo de smallint
            primaryKey: true,
            allowNull: false, // Unchecked = NOT NULL
            autoIncrement: false, // Crucial para la migración de IDs existentes
        },

        // Clave Foránea a Municipio
        IDMunicipio: {
            type: DataTypes.INTEGER, // Mapeo de smallint
            allowNull: false, // Unchecked = NOT NULL
            references: {
                model: Municipio, // o Municipality, según tu estructura
                key: "MunicipalityId", // O el nombre real de la PK en Municipio/Maps
            },
        },

        // Clave Foránea a Distrito Municipal
        IDDistritoMunicipal: {
            type: DataTypes.INTEGER, // Mapeo de smallint
            allowNull: true, // Checked = NULL
        },

        // Código de Ciudad/Barrio
        CodigoCiudad: {
            type: DataTypes.STRING(2), // Mapeo de varchar(2)
            allowNull: true, // Checked = NULL
        },

        // Descripción
        Descripcion: {
            type: DataTypes.STRING(50), // Mapeo de varchar(50)
            allowNull: true,
        },

        // Oficio
        Oficio: {
            type: DataTypes.BIGINT, // Mapeo de bigint
            allowNull: true,
        },

        // Estatus
        Estatus: {
            type: DataTypes.CHAR(1), // Mapeo de char(1)
            allowNull: true,
        },

        // IdUsuarioCreacion
        IdUsuarioCreacion: {
            type: DataTypes.INTEGER, // Mapeo de int
            allowNull: true,
        },

        // FechaCreacion
        FechaCreacion: {
            type: DataTypes.DATE, // Mapeo de smalldatetime
            allowNull: false, // Unchecked = NOT NULL
        },

        // IdUsuarioModificacion
        IdUsuarioModificacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // FechaModificacion
        FechaModificacion: {
            type: DataTypes.DATE, // Mapeo de smalldatetime
            allowNull: true,
        },

        // RegID (UUID de SQL Server)
        RegID: {
            type: DataTypes.UUID, // Mapeo de uniqueidentifier
            allowNull: true,
        },
    },
    {
        // Deshabilita las columnas automáticas createdAt y updatedAt
        timestamps: false,
        // Si quieres que el nombre de la tabla sea exactamente 'Ciudad' o 'Barrio', puedes usar:
        // freezeTableName: true,
    }
);

module.exports = City;
