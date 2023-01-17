const db = require("../utils/database");
const Map = require('./map.models')

const { DataTypes } = require("sequelize");

const Precinct = db.define("precinct", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  province: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      key: 'id',
      model: Map
    }
  },
  municipality: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      key: 'id',
      model: Map
    }
  },
  district: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references:{
      key: 'id',
      model: Map
    }
  },
  address:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  college:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  table:{
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  //? Evita que sequelize cree la columna de createdAt y updatedAt
  timestamps: false
});

module.exports = Precinct