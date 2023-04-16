const db = require("../utils/database");
const Users = require("./users.models");

const { DataTypes } = require("sequelize");

const Todo = db.define("todo", {
  id: { 
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  limit: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'is_active',
    defaultValue: true
  },
  responsible: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      key: 'id',
      model: Users
    }
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      key: 'id',
      model: Users
    }
  }
});

module.exports = Todo