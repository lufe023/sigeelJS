const db = require("../utils/database");


const { DataTypes } = require("sequelize");

const Ballot = db.define("ballot", {
  candidateId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    field: 'candidate_id'
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  party: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture:{
    type: DataTypes.TEXT,
    validate:{
      isUrl: true
    }
  }
});

module.exports = Ballot