const db = require("../utils/database");
const { DataTypes } = require("sequelize");

const Roles = db.define("user_roles", {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique:true
    },

roleName: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'role_name',
    },
//los niveles de usuario deberian ir desde 1 colla
level: {
    type: DataTypes.INTEGER,
    allowNull: false
}

});

module.exports = Roles