const db = require("../utils/database");
const Maps = require("./maps.models");

const { DataTypes } = require("sequelize");
const Precincts = require("./precinct.models");

const College = db.define("college", {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique:true,
    primaryKey: true,
  },
  precinct: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      key: 'id',
      model: Precincts
    }
  },
  
  electLocal:{
  type: DataTypes.INTEGER,
  },
  
  electExterior:{
  type: DataTypes.INTEGER,
  },
  meta:{
    type: DataTypes.INTEGER,
    },
}
);

module.exports = College