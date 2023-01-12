const db = require("../utils/database");
const { DataTypes } = require("sequelize");

const Maps = db.define("maps", {
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

module.exports = Maps