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
});

module.exports = teamsMembers