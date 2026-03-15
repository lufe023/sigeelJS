const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Usuario = require("./users.models");
const Municipio = require("./municipio.models");

const UsuarioMunicipio = db.define(
    "usuario_municipio",
    {
        UsuarioMunicipioId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field: "UsuarioMunicipioId",
        },
        idusuario: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Usuario,
                key: "id",
            },
        },
        idmunicipio: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Municipio,
                key: "MunicipalityId",
            },
        },
        estatus: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
    },
    {
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["idusuario", "idmunicipio"], // 🔹 evita duplicados
            },
            {
                fields: ["idusuario"], // 🔹 acelera búsquedas por usuario
            },
            {
                fields: ["idmunicipio"], // 🔹 acelera búsquedas por municipio
            },
        ],
    },
);

module.exports = UsuarioMunicipio;
