const db = require("../utils/database");
const Census = require('./census.models');
const Roles = require('./roles.models')

const { DataTypes } = require("sequelize");

const Users = db.define("users", {
  id: { 
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
        isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userRoleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: Roles
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'is_verified',
    defaultValue: false
  },
  censuCitizenID:{
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
    field: 'citizen_identification',
    references: {
      key: 'citizen_id',
      model: Census
    }
},
teamLeader:{
  type: DataTypes.UUID
},
passwordRequest:{
  type: DataTypes.UUID,
  allowNull: true
}
});

module.exports = Users