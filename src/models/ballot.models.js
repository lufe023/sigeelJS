const db = require("../utils/database");


const { DataTypes } = require("sequelize");
const Maps = require("./maps.models");
const Parties = require("./parties.models");

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
    type: DataTypes.UUID,
    allowNull: false,
    references:{
      key: 'id',
      model: Parties
    },
  },
  partyAcronym:{
    type: DataTypes.STRING,
    allowNull: false
  },
  nomination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture:{
    type: DataTypes.TEXT,
    allowNull:true
  },
  distritoMunicipal:{
    type: DataTypes.INTEGER,
    allowNull:true,
    field: "distrito_municipal",
    references:{
      key: 'id',
      model: Maps
    },
  },
  municipio:{
    type: DataTypes.INTEGER,
    allowNull:true,
    references:{
      key: 'id',
      model: Maps
    },
  },
  provincia:{
    type: DataTypes.INTEGER,
    references:{
      key: 'id',
      model: Maps
    },
  }
});

module.exports = Ballot