const db = require("../utils/database");

const { DataTypes } = require("sequelize");
const Ciudadseccion = require("./ciudadseccion.model");
const Parties = require("./parties.models");
const Provincia = require("./provincia.models");
const Municipio = require("./municipio.models");

const Ballot = db.define("ballot", {
    candidateId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: "candidate_id",
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    party: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            key: "id",
            model: Parties,
        },
    },

    nomination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    picture: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ciudadSeccion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ciudadSeccion",
        references: {
            model: Ciudadseccion,
            key: "CiudadseccionId",
        },
    },
    municipio: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            key: "MunicipalityId",
            model: Municipio,
        },
    },
    provincia: {
        type: DataTypes.INTEGER,
        references: {
            key: "ProvinciaId",
            model: Provincia,
        },
    },
});

module.exports = Ballot;
