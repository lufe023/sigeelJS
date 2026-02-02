// models/usuarioSectorParaje.models.js
const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Usuario = require("./users.models");
const SectorParaje = require("./sectorParaje.model");

const UsuarioSectorParaje = db.define(
    "usuario_sector_paraje",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idusuario: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Usuario,
                key: "id",
            },
        },
        idsectorparaje: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: SectorParaje,
                key: "SectorParajeId",
            },
        },
        estatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: false,
        indexes: [
            { unique: true, fields: ["idusuario", "idsectorparaje"] },
            { fields: ["idusuario"] },
        ],
    },
);

module.exports = UsuarioSectorParaje;
