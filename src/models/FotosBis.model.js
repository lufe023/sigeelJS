const { DataTypes } = require("sequelize");
const { dbFotos } = require("../utils/database");

const FotoBIS = dbFotos.define(
    "FOTOS_BIS_BIS",
    {
        Cedula: {
            type: DataTypes.STRING(11),
            allowNull: false,
            primaryKey: true,
        },
        Imagen: {
            type: DataTypes.BLOB("long"), // varbinary(MAX)
            allowNull: true,
        },
        Fecha: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        Verificador: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "FOTOS_BIS_BIS",
        timestamps: false,
    }
);

module.exports = FotoBIS;
