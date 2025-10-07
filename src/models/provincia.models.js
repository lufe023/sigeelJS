const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Municipality = require("./municipio.models");

const Provincia = db.define(
    "provincia",
    {
        // Clave Primaria (ID)
        ProvinciaId: {
            type: DataTypes.INTEGER, // smallint en SQL Server se mapea a INTEGER
            primaryKey: true,
            unique: true,
            allowNull: false, // NOT NULL en SQL Server
            autoIncrement: false, // Crucial para importar IDs existentes
        },

        // Descripcion
        Descripcion: {
            type: DataTypes.STRING(30), // varchar(30)
            allowNull: true,
        },

        // IDMunicipioCabecera (Asumo que es una FK a la tabla Municipio/Maps)
        IDMunicipioCabecera: {
            type: DataTypes.INTEGER, // smallint se mapea a INTEGER
            allowNull: true,
            // Si tiene FK:
        },

        // Oficio
        Oficio: {
            type: DataTypes.STRING(10), // varchar(10)
            allowNull: true,
        },

        // Estatus
        Estatus: {
            type: DataTypes.CHAR(1), // char(1)
            allowNull: true,
        },

        // ZONA
        ZONA: {
            type: DataTypes.STRING(2), // varchar(2)
            allowNull: true,
        },

        // RegID (UUID de SQL Server)
        RegID: {
            type: DataTypes.UUID, // uniqueidentifier se mapea a UUID
            allowNull: true,
        },

        // Region
        Region: {
            type: DataTypes.INTEGER, // int se mapea a INTEGER
            allowNull: true,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Provincia;
