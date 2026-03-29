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
            field: 'id' // Especificamos el nombre exacto de la columna
        },
        idusuario: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'idusuario' // Forzamos que no busque id_usuario
        },
        idsectorparaje: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'idsectorparaje'
        },
      estatus: {
    type: DataTypes.BOOLEAN,
    field: 'estatus',
    defaultValue: true,
    // A veces, omitir explícitamente el allowNull ayuda si en la DB dice NULL
},
    },
    {
        tableName: "usuario_sector_parajes",
        timestamps: false,
        // DESACTIVA underscored si tus nombres en la DB no tienen guiones bajos
        underscored: false, 
        indexes: [
            // Deja solo el índice que realmente quieres mantener controlado por Sequelize
            {
                name: "idx_usuario_sector_active",
                fields: ["idusuario", "estatus"],
                where: { estatus: true },
            },
            {
                name: "usuario_sector_parajes_idusuario_idsectorparaje", // Usa el nombre exacto de la DB
                unique: true,
                fields: ["idusuario", "idsectorparaje"],
            },
        ],
    },
);

module.exports = UsuarioSectorParaje;
