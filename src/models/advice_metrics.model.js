const db = require('../utils/database');
const { DataTypes } = require('sequelize');
const Users = require('./users.models');

const  AdviceMetrics = db.define('AdviceMetrics', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    adviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'advice',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Users,
        key: 'id'
      },
      onDelete: 'CASCADE' // Para mantener una relación de una a muchos con el modelo de usuario
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    where: {
      type: DataTypes.STRING(200),
      allowNull: true // Para rastrear la fuente donde se hizo la acción (por ejemplo, "Website", "App")
    }
  })
    module.exports = AdviceMetrics;