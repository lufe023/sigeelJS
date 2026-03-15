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
        tableName: "usuario_sector_parajes", // <--- FUERZA el nombre exacto de la DB
        timestamps: false,
        underscored: true, // Ayuda si usas snake_case en la DB
        indexes: [
            {
                name: "idx_usuario_sector_active", // Nombre personalizado
                fields: ["idusuario", "estatus"],
                where: { estatus: true }, // Índice parcial (Postgres lo ama)
            },
            {
                unique: true,
                fields: ["idusuario", "idsectorparaje"],
            },
        ],
    },
);

module.exports = UsuarioSectorParaje;
