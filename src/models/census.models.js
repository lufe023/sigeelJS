const db = require("../utils/database");
const College = require("./college.models");
const Provincia = require("./provincia.models");
const Municipality = require("./municipio.models");
const Ciudadseccion = require("./ciudadSeccion.model");
const Audit = require("./audit.models");
const Sectorparaje = require("./sectorParaje.model");
const { DataTypes } = require("sequelize");
const Usuario = require("./users.models");
const Precincts = require("./precinct.models");

const Census = db.define(
    "census",
    {
        id: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: DataTypes.UUIDV4,
        },
        firstName: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: "first_name",
        },

        lastName: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: "last_name",
        },
        lastNameB: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: "last_nameB",
        },
        nickname: {
            type: DataTypes.TEXT,
        },
        citizenID: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            field: "citizen_id",
            primaryKey: true,
            // Añadir índice en la columna citizenID
        },

        birthDay: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        placeBirth: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING,
        },
        IdEstadoCivil: {
            type: DataTypes.STRING,
        },
        IdCategoria: {
            type: DataTypes.INTEGER,
        },
        IdCausaCancelacion: {
            type: DataTypes.INTEGER,
        },
        IdMunicipioOrigen: {
            type: DataTypes.INTEGER,
        },
        IdRecintoOrigen: {
            type: DataTypes.INTEGER,
        },
        CodigoRecintoOrigen: {
            type: DataTypes.STRING,
        },
        IdColegioOrigen: {
            type: DataTypes.INTEGER,
        },
        ColegioOrigen: {
            type: DataTypes.STRING,
        },
        picture: {
            type: DataTypes.TEXT,
            validate: {
                //  isUrl: true
            },
        },
        province: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                key: "ProvinciaId",
                model: Provincia,
            },
        },
        municipality: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                key: "MunicipalityId",
                model: Municipality,
            },
        },
        IDSectorParaje: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Sectorparaje,
                key: "SectorParajeId",
            },
        },

        CodigoCircunscripcion: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        adress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        celphone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otherPhone: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "other_phone",
        },
        PrecinctId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Precincts,
                key: "PrecinctId",
            },
        },
        PrecintCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CollegeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: College,
                key: "CollegeId",
            },
        },
        CollegeCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        position: {
            type: DataTypes.INTEGER,
        },
        LugarVotacion: {
            type: DataTypes.STRING,
        },
        IdMunicipioExterior: {
            type: DataTypes.INTEGER,
        },
        IDRecintoExterior: {
            type: DataTypes.INTEGER,
        },
        IDColegioExterior: {
            type: DataTypes.INTEGER,
        },
        CodigoRecintoExterior: {
            type: DataTypes.STRING,
        },
        ColegioExterior: {
            type: DataTypes.STRING,
        },
        PosPaginaExterior: {
            type: DataTypes.INTEGER,
        },
        outside: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        nombresplastico: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        apellidosplastico: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        //referencia a usuarios llave foranea de users
        leader: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        // ... (otras opciones de modelo)
        indexes: [
            // Añadir índices compuestos si es necesario
            {
                fields: [
                    "id",
                    "province",
                    "municipality",
                    "leader",
                    "citizen_id",
                    "CollegeId",
                ],
            },
            // ... (otros índices)
        ],
    }
);

Census.afterUpdate(async (census, options) => {
    const changedFields = census.changed();

    if (changedFields.length > 0) {
        const changedValues = {};
        changedFields.forEach((fieldName) => {
            changedValues[fieldName] = census[fieldName];
        });

        await Audit.create({
            tableName: "census",
            recordId: census.citizenID,
            changedFields: changedValues,
        });
    }
});
module.exports = Census;
