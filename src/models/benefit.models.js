const db = require("../utils/database");
const Census = require("./census.models");


const { DataTypes } = require("sequelize");

const Benefit = db.define("benefit", {
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
  benefitDescription: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'benefit_description'
  },
  receiveAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
},{
createdAt:false,
});

module.exports = Benefit