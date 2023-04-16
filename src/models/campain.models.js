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
    type:DataTypes.STRING,
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
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_at'
  },
  finishAt:{
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'finish_at'
  },
});

module.exports = Campain