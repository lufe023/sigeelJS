const db = require("../utils/database");

const { DataTypes, UUID } = require("sequelize");

const TiesTypes = db.define("tiesTypes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey:true,
    allowNull: false,
    unique:true,
    autoIncrement:true
    },
  
  tiesDescription:{
    type: DataTypes.STRING,
    allowNull: false,
  }
},{
createdAt:false,
},
{
  // ... (otras opciones de modelo)
  indexes: [
    // Añadir índices compuestos si es necesario
    {
      fields: ['id', 'tiesDescription']
    },
    // ... (otros índices)
  ]
});

module.exports = TiesTypes