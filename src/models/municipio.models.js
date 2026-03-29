const { DataTypes } = require("sequelize");
const db = require("../utils/database");

// Asumiendo que Maps es la tabla de provincias/municipios padre
const Provincia = require("./provincia.models"); // Importar el propio modelo si IDMunicipioPadre referencia a Municipios
// const Municipality = require("./municipality.models");

const Municipality = db.define(
    "municipio",
    {
        // 1. Clave Primaria - USAR FIELD POR LAS MAYÚSCULAS
        MunicipalityId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: false,
            field: 'MunicipalityId' // Exactamente como en el DDL
        },

        description: {
            type: DataTypes.STRING(35),
            allowNull: true,
            field: 'description'
        },

        // 2. FK a Provincia
        ProvinciaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'ProvinciaId', // Exactamente como en el DDL
            references: {
                model: 'provincia', // Nombre de la tabla destino
                key: 'ProvinciaId'
            }
        },

        parentMunicipalityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'parentMunicipalityId'
        },

        oficio: {
            type: DataTypes.DECIMAL(18, 0),
            allowNull: true,
            field: 'oficio'
        },

        status: {
            type: DataTypes.STRING(1),
            allowNull: true,
            field: 'status'
        },

        dm: {
            type: DataTypes.CHAR(1),
            allowNull: true,
            field: 'dm'
        },

        createdByUserId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'createdByUserId'
        },

        regId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'regId'
        },
    },
    {
        tableName: "municipios", // <--- DEBE SER PLURAL SEGÚN TU DDL
        timestamps: false,
        underscored: false 
    },
    {
        // Deshabilita las columnas automáticas createdAt y updatedAt
        timestamps: false,
        // Mapeo manual de tus columnas de auditoría
        // Nota: Aunque deshabilitas timestamps, si mapeas estas columnas manualmente,
        // Sequelize las creará si no existen.
    }
);

module.exports = Municipality;
