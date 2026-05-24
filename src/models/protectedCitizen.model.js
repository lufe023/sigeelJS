// models/protectedCitizen.model.js
const { DataTypes } = require("sequelize");
const  db  = require("../utils/database");

const ProtectedCitizen = db.define("protected_citizen", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    citizenID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    protected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true // Al registrarse, entra protegido por defecto
    },
    createdBy: {
        type: DataTypes.UUID, 
        allowNull: false
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true // Nulo hasta que alguien modifique el estado original
    }
}, {
    timestamps: true
});

module.exports = ProtectedCitizen;