const db = require("../utils/database");
const Census = require("./census.models");
const tipesTypes = require('./tiesTypes.models')

const { DataTypes, UUID } = require("sequelize");
const Users = require("./users.models");

const Ties = db.define("ties", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  aCiticenID: {
    type: DataTypes.STRING,
    allowNull: false,
    references:{
      key: 'citizen_id',
      model: Census
    },
    field: "a_citizen_id"
  }, 
  bCiticenID: {
    type: DataTypes.STRING,
    allowNull: false,
    references:{
      key: 'citizen_id',
      model: Census
    },
    field: "b_citizen_id"
  },
  ties:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      key: 'id',
      model: tipesTypes
    }
  },
  active:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  },
  createdBy:{
    type:DataTypes.UUID,
    references:{
      key: 'id',
      model: Users
    },
  }
},{
createdAt:false,
});

module.exports = Ties