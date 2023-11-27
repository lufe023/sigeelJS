const db = require("../utils/database");


const { DataTypes } = require("sequelize");
const Users = require("./users.models");

const Banner = db.define("banner", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  title:{
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle:{
    type: DataTypes.STRING,
    allowNull: true
  },
  body:{
    type: DataTypes.TEXT,
    allowNull: true
  },
  place:{
    type: DataTypes.STRING,
    allowNull: false
  },
  createdBy:{
    type: DataTypes.UUID,
    allowNull: false,
    references:{
      key: 'id',
      model: Users
    },
  }
}
,
{
  // ... (otras opciones de modelo)
  indexes: [
    // Añadir índices compuestos si es necesario
    {
      fields: ['id', 'title', 'place']
    },
    // ... (otros índices)
  ]
});

module.exports = Banner