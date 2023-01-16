const db = require("../utils/database");
const Census = require("./census.models");


const { DataTypes } = require("sequelize");

const Gps = db.define("gps", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  citicenID: {
    type: DataTypes.STRING,
    allowNull: false,
    references:{
      key: 'citizen_id',
      model: Census
    },
    field: "citizen_id"
  },
  
  latitud:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitud:{
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Gps