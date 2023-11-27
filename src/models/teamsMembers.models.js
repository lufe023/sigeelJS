const db = require("../utils/database");

const { DataTypes } = require("sequelize");
const Users = require("./users.models");
const Teams = require("./teams.models");

const teamsMembers = db.define("teamMembers", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: false,
    references:{
      key: 'id',
      model: Teams
    }
  },
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
    references:{
      key: 'id',
      model: Users
    }
  },
  teamLeader:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  }
},{
  // ... (otras opciones de modelo)
  indexes: [
    // Añadir índices compuestos si es necesario
    {
      fields: ['id', 'teamId','memberId','teamLeader']
    },
    // ... (otros índices)
  ]
});

module.exports = teamsMembers