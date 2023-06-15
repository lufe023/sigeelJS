const db = require("../utils/database");

const { DataTypes } = require("sequelize");
const Users = require("./users.models");

const Teams = db.define("teams", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references:{
      key: 'id',
      model: Users
    }
  },
  logo:{
    type: DataTypes.TEXT
  },
  description: {
    type: DataTypes.TEXT
  },
});

module.exports = Teams