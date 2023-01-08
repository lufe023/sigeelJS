const db = require("../utils/database");
const { DataTypes } = require("sequelize");

const Map = db.define("map", {

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

type: {
    type: DataTypes.TEXT,
    allowNull: false
}

});

module.exports = Map