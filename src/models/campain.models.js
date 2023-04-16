const db = require("../utils/database");


const { DataTypes } = require("sequelize");
const Maps = require("./maps.models");
const Users = require("./users.models");

const Campain = db.define("campain", {
  id: {
    type: DataTypes.UUID,
    unique:true,
    primaryKey: true,
    allowNull: false,
  },
  name:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  details:{
    type:DataTypes.TEXT,
    allowNull:true
  },
  neighbourhood:{
    type: DataTypes.INTEGER,
    references:{
      key: 'id',
      model: Maps
    },
  },
  distritoMunicipal:{
    type: DataTypes.INTEGER,
    field: "distrito_municipal",
    references:{
      key: 'id',
      model: Maps
    },
  },
  municipio:{
    type: DataTypes.INTEGER,
    references:{
      key: 'id',
      model: Maps
    },
  },
  provincia:{
    type: DataTypes.INTEGER,
    references:{
      key: 'id',
      model: Maps
    },
  },
  active:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  createdBy:{
    type: DataTypes.UUID,
    field: "created_by",
    allowNull:false,
    references:{
      key: 'id',
      model: Users
    },
  },
  startAt:{
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_at'
  },
  finishAt:{
    type: DataTypes.DATE,
    allowNull: false,
    field: 'finish_at'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

module.exports = Campain