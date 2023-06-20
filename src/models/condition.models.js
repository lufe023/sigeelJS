const db = require("../utils/database");
const Census = require("./census.models");


const { DataTypes } = require("sequelize");

const Condition = db.define("condition", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  citizenID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
    references:{
      key: 'citizen_id',
      model: Census
    },
    field: "citizen_id"
  },
  conditionDetails: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Dyslexia:{
    type: DataTypes.BOOLEAN,
  },
  visual:{
    type: DataTypes.BOOLEAN,
  },
  auditory:{
    type: DataTypes.BOOLEAN,
  },
  motor:{
    type: DataTypes.BOOLEAN,
  },
  cognitive:{
    type: DataTypes.BOOLEAN,
  },
});

module.exports = Condition