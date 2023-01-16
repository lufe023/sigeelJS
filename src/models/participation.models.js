const db = require("../utils/database");
const Census = require("./census.models");


const { DataTypes } = require("sequelize");

const Participation = db.define("participation", {
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
  activityDescription: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'activity_description'
  },
  receiveAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
},{
createdAt:false,
});

module.exports = Participation