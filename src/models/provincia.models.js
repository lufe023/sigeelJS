const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Municipality = require("./municipio.models");

const Provincia = db.define(
    "provincia",
    {
        ProvinciaId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: 'ProvinciaId' // Obligatorio por las mayúsculas
        },
        Descripcion: {
            type: DataTypes.STRING(30), // Coincide con varchar(30)
            allowNull: true,
            field: 'Descripcion'
        },
        IDMunicipioCabecera: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'IDMunicipioCabecera'
        },
        Oficio: {
            type: DataTypes.STRING(10), // Coincide con varchar(10)
            allowNull: true,
            field: 'Oficio'
        },
        Estatus: {
            type: DataTypes.CHAR(1), // Coincide con bpchar(1)
            allowNull: true,
            field: 'Estatus'
        },
        ZONA: {
            type: DataTypes.STRING(2), // Coincide con varchar(2)
            allowNull: true,
            field: 'ZONA'
        },
        RegID: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'RegID'
        },
        Region: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'Region'
        }
    },
    {
        tableName: "provincia",
        timestamps: false,
        underscored: false // Evita que Sequelize meta guiones bajos donde no van
    },
    {
        timestamps: false,
    }
);

module.exports = Provincia;
