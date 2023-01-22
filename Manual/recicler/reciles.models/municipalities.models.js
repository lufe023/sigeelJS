const db = require("../utils/database");
const { DataTypes } = require("sequelize");
const Provinces = require('./provinces.models')
const Municipalities = db.define("municipalities", {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique:true
    },

name: {
    type: DataTypes.TEXT,
    allowNull: false
    },
//se utilizará para tener un superior ej: un distrito de nombre z tiene como superior a un municipio de nombre y, y este municipio tiene una provincia superior x , etc
parent:{
    type: DataTypes.INTEGER,
    allowNull: true,
    references:{
        model:Provinces,
        key: 'id'
    }
}
}
, {
    //? Evita que sequelize cree la columna de createdAt y updatedAt
    timestamps: false
});

module.exports = Municipalities