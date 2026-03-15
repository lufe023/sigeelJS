const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Ciudadseccion = require("./ciudadseccion.model");

const SectorParaje = db.define(
    "sectorparaje",
    {
        // Clave Primaria (ID)
        SectorParajeId: {
            type: DataTypes.INTEGER, // Mapeo de smallint
            primaryKey: true,
            allowNull: false, // Unchecked = NOT NULL
            autoIncrement: false, // Crucial para la migración de IDs existentes
        },
        IDCiudadSeccion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "IDCiudadSeccion",
            references: {
                model: Ciudadseccion,
                key: "CiudadseccionId",
            },
        },
        CodigoSector: {
            type: DataTypes.STRING(8), // Mapeo de varchar(2)
        },
        Descripcion: {
            type: DataTypes.STRING(70), // Mapeo de varchar(50)
        },
        Oficio: {
            type: DataTypes.DECIMAL,
        },
        Estatus: {
            type: DataTypes.CHAR(1), // Mapeo de char(1)
        },
        RegID: {
            type: DataTypes.UUID, // uniqueidentifier se mapea a UUID
        },
    },
    {
        timestamps: false,
    },
);

module.exports = SectorParaje;
