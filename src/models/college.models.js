// models/college.models.js

const db = require("../utils/database");
const Municipio = require("./municipio.models"); // Necesario para referenciar IDMunicipio
const { DataTypes } = require("sequelize");
const Precincts = require("./precinct.models");

const College = db.define(
    "college",
    {
        CollegeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: false,
        },
        collegeNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        MunicipalityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Municipio,
                key: "MunicipalityId", // Asumo que la PK de Maps es 'id'
            },
        },

        // ⬅️ Columna Descripcion
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // Clave Foránea a Precincts
        PrecinctId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Precincts,
                key: "PrecinctId",
            },
        },

        electLocal: {
            type: DataTypes.INTEGER,
        },

        electExterior: {
            type: DataTypes.INTEGER,
        },

        meta: {
            type: DataTypes.INTEGER,
        },

        TieneCupo: {
            type: DataTypes.STRING,
            defaultValue: false,
        },
        CantidadReservada: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        RegID: {
            type: DataTypes.UUID,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = College;
