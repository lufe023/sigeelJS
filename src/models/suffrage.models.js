const db = require("../utils/database");
const Census = require("./census.models");


const { DataTypes } = require("sequelize");
const Users = require("./users.models");

const Suffrages = db.define("suffrages", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  citizenID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    references:{
      key: 'citizen_id',
      model: Census
    },
    field: "citizen_id"
  },
  suffrage: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false
  },
registerBy:{
  type: DataTypes.UUID,
  allowNull:false,
  references:{
    key: 'id',
    model: Users
  },
}
});

module.exports = Suffrages