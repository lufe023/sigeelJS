const db = require("../utils/database");



const { DataTypes } = require("sequelize");

const Parties = db.define("parties", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },

  partyName:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  partyAcronyms: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color:{
    type: DataTypes.STRING,
    allowNull:true
  }
  
},{
createdAt:false,
updatedAt:false
});

module.exports = Parties