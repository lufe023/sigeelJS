const { DataTypes } = require("sequelize");
const db = require("../utils/database");

// Asumiendo que Maps es la tabla de provincias/municipios padre
const Provincia = require("./provincia.models"); // Importar el propio modelo si IDMunicipioPadre referencia a Municipios
// const Municipality = require("./municipality.models");

const Municipality = db.define(
    "municipio",
    {
        // Clave Primaria (Mapeo de ID)
        MunicipalityId: {
            type: DataTypes.INTEGER, // Mapeo de smallint
            primaryKey: true,
            allowNull: false, // Unchecked en SQL Server = NOT NULL
            autoIncrement: false, // Crucial para la migración
        },

        // 1. Descripcion
        description: {
            type: DataTypes.STRING(35), // Mapeo de varchar(35)
            allowNull: true, // Checked = NULL
        },

        // 2. FK a Provincia (Mapeo de IDProvincia)
        ProvinciaId: {
            type: DataTypes.INTEGER, // Mapeo de smallint
            allowNull: false, // Unchecked = NOT NULL
            references: {
                model: Provincia, // Asumiendo que Provinces están en Maps
                key: "ProvinciaId", // Asumiendo que la PK de Maps es 'id'
            },
        },

        // 3. FK a Municipio Padre (Mapeo de IDMunicipioPadre)
        parentMunicipalityId: {
            type: DataTypes.INTEGER, // Mapeo de smallint
            allowNull: true, // Checked = NULL
        },

        // 4. Oficio
        oficio: {
            type: DataTypes.DECIMAL(18, 0), // Mapeo de decimal(18, 0)
            allowNull: true,
        },

        // 5. Estatus
        status: {
            type: DataTypes.STRING(1), // Mapeo de varchar(1)
            allowNull: true,
        },

        // 6. DM (Distrito Municipal)
        dm: {
            type: DataTypes.CHAR(1), // Mapeo de char(1)
            allowNull: true,
        },

        // Campos de Auditoría: No crearemos las columnas de Sequelize 'createdAt' y 'updatedAt'
        // ya que tienes tus propias columnas de auditoría. Usaremos la opción 'timestamps: false'.

        // 7. IdUsuarioCreacion
        createdByUserId: {
            type: DataTypes.INTEGER, // Mapeo de int
            allowNull: true,
        },

        // 11. RegID (UUID de SQL Server)
        regId: {
            type: DataTypes.UUID, // Mapeo de uniqueidentifier
            allowNull: true,
        },
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
