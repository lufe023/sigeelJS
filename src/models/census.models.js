const db = require("../utils/database");
const College = require("./college.models");
const Maps = require("./maps.models");
const Audit = require('./audit.models');


const { DataTypes } = require("sequelize");

const Census = db.define("census", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  firstName: {
    type:DataTypes.TEXT,
    allowNull: false,
    field: 'first_name'
  },

  lastName: {
    type:DataTypes.TEXT,
    allowNull: false,
    field: 'last_name'
  },
  nickname: {
    type: DataTypes.TEXT,
  },
  citizenID:{
    type: DataTypes.STRING,
    unique:true,
    allowNull: false,
    field: 'citizen_id',
    primaryKey: true,
  },

  age: {
    type: DataTypes.INTEGER
  },
  gender:{
    type: DataTypes.TEXT,
  },
  picture:{
    type: DataTypes.TEXT,
    validate:{
    //  isUrl: true
    }
  },
  province: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      key: 'id',
      model: Maps
    }
  },
  municipality: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      key: 'id',
      model: Maps
    }
  },
  district: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references:{
      model: Maps,
      key: 'id'
    }

  },
  neighbourhood: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references:{
      model: Maps,
      key: 'id'
    }
  },
  adress:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  celphone:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  telephone:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  otherPhone:{
    type: DataTypes.STRING,
    allowNull: true,
    field: 'other_phone'
  },

  college: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references:{
      model: College,
      key: 'id'
    }
  },
position:{
  type: DataTypes.INTEGER,
},
outside:{
  type:DataTypes.BOOLEAN,
  allowNull:true
},
  //referencia a usuarios llave foranea de users
  leader:{
    type: DataTypes.UUID,
    allowNull: true,
  },
});


Census.beforeUpdate(async (census, options) => {
  const changedFields = census.changed();

  if (changedFields.length > 0) {
    // Construye un objeto con los nombres y valores de los campos modificados
    const changedValues = {};
    changedFields.forEach(fieldName => {
      changedValues[fieldName] = census[fieldName];
    });

    // Crea un registro en la tabla de auditoría
    await Audit.create({
      tableName: 'census',
      recordId: census.citizenID, // Cambia esto según la propiedad que almacena el ID en Census
      changedFields: changedValues,
    });
  }
});

module.exports = Census