const db = require('../utils/database');
const { DataTypes } = require('sequelize');
const Users = require('./users.models');


const Advice = db.define('advice', {
id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
    title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  dateStart: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dateEnd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Users,
      key: 'id',
    },
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  showDelegate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  showColaborators: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  showAdministrators: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // El tipo de anuncio
  },
  displayLocation: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ubicación o widget donde se publica el anuncio en la web',
  },

});

module.exports = Advice;




