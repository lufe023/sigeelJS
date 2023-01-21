const db = require("../utils/database");
const Provinces = require('./provinces.models')
const Municipalities = require("./municipalities.models");
const Districts = require("./district.models");

const { DataTypes } = require("sequelize");

const Precincts = db.define("precincts", {
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
      model: Provinces
    }
  },
  municipality: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      key: 'id',
      model: Municipalities
    }
  },
  district: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references:{
      key: 'id',
      model: Districts
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

module.exports = Precincts