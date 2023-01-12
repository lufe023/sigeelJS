const db = require("../utils/database");
const Map = require('./map.models')

const { DataTypes } = require("sequelize");

const Census = db.define("census", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type:DataTypes.TEXT,
    allowNull: false,
    field: 'first_name'
  },

  lastName: {
    type:DataTypes.TEXT,
    allowNull: false,
    field: 'last_name'
  },
  nickname: {
    type: DataTypes.TEXT,
  },
  citizenID:{
    type: DataTypes.STRING,
    unique:true,
    allowNull: false,
    field: 'citizen_id'
  },

  age: {
    type: DataTypes.INTEGER
  },
  gender:{
    type: DataTypes.TEXT,
  },
  picture:{
    type: DataTypes.TEXT,
    validate:{
      isUrl: true
    }
  },
  province: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      key: 'id',
      model: Map
    }
  }

});

module.exports = Census