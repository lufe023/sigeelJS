const { DataTypes } = require("sequelize");
const db = require("../utils/database");

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
            type: DataTypes.INTEGER, // Mapeo de smallint
            allowNull: true,
            references: {
                model: "ciudadseccion", // o District, según tu estructura
                key: "CiudadseccionId", // O el nombre real de la PK en Municipio/Maps
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
        // Deshabilita las columnas automáticas createdAt y updatedAt
        timestamps: false,
        // Si quieres que el nombre de la tabla sea exactamente 'Ciudad' o 'Barrio', puedes usar:
        // freezeTableName: true,
    }
);

module.exports = SectorParaje;
