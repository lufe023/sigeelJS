const db = require("../utils/database");
const Census = require("./census.models");
const Users = require('./users.models')

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
    field: "citizen_id",
    unique: true
  },
  
  latitud:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitud:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  gotAutomatic:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  createdBy:{
    type: DataTypes.UUID,
    references:{
      key: 'id',
      model: Users
    }
  }
});

module.exports = Gps