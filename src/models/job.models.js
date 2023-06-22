const db = require("../utils/database");
const Census = require("./census.models");


const { DataTypes } = require("sequelize");

const Job = db.define("job", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  citicenID: {
    type: DataTypes.STRING,
    allowNull: false,
    references:{
      key: 'citizen_id',
      model: Census
    },
    field: "citizen_id"
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true
  },
  positionDetails: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'position_details'
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  finishAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
},{
createdAt:false,
});

module.exports = Job