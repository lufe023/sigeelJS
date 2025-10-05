const db = require("../utils/database");
const Maps = require("./maps.models");

const { DataTypes } = require("sequelize");

const Precincts = db.define(
    "precincts",
    {
        PrecinctId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: false,
        },
        precintNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        direccionRecinto: {
            type: DataTypes.STRING,
        },
        IDSectorParaje: {
            type: DataTypes.INTEGER,
        },
        IDCircunscripcion: {
            type: DataTypes.INTEGER,
        },
        IDBarrio: {
            type: DataTypes.INTEGER,
        },
        CapacidadRecinto: {
            type: DataTypes.INTEGER,
        },
        Oficio: {
            type: DataTypes.STRING,
        },
        Estatus: {
            type: DataTypes.STRING,
        },
        DescripcionLarga: {
            type: DataTypes.STRING,
        },
        DireccionLarga: {
            type: DataTypes.STRING,
        },

        Tipo: {
            type: DataTypes.STRING,
        },
        Codigo: {
            type: DataTypes.STRING,
        },
        RegID: {
            type: DataTypes.UUID,
        },
        latitud: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        longitud: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        electLocal: {
            type: DataTypes.INTEGER,
        },
        electExterior: {
            type: DataTypes.INTEGER,
        },
        provincia: {
            type: DataTypes.INTEGER,
            references: {
                key: "id",
                model: Maps,
            },
        },
        municipio: {
            type: DataTypes.INTEGER,
            references: {
                key: "id",
                model: Maps,
            },
        },

        distrito: {
            type: DataTypes.INTEGER,

            allowNull: true,
        },
        circunscripcion: {
            type: DataTypes.STRING,
        },
    },
    {
        //? Evita que sequelize cree la columna de createdAt y updatedAt
        timestamps: false,
    }
);

module.exports = Precincts;
