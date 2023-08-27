const db = require('../utils/database');
const { DataTypes } = require('sequelize');
const Census = require('./census.models');

const Audit = db.define('audit', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tableName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recordId: {
      type: DataTypes.STRING, // Cambiado a STRING para usar citizenId
      allowNull: false,
    },
    changedFields: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  

  module.exports = Audit;
