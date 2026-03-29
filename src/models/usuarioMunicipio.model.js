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
            field: "idusuario", // 💡 Crucial para que coincida con el DDL
        },
        idmunicipio: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "idmunicipio", // 💡 Crucial para que coincida con el DDL
        },
        estatus: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
            field: "estatus", // Evita que intente cambiar el tipo a BOOLEAN cada vez
        },
    },
    {
        tableName: "usuario_municipios", // Forzamos el nombre exacto de tu DB
        timestamps: false,
        underscored: false,
        indexes: [
            {
                unique: true,
                fields: ["idusuario", "idmunicipio"], 
            },
            {
                fields: ["idusuario"], 
            },
            {
                fields: ["idmunicipio"],
            },
        ],
    },
);

module.exports = UsuarioMunicipio;
