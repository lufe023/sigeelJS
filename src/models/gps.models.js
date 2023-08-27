const db = require("../utils/database");
const Census = require("./census.models");
const Users = require('./users.models')
const Audit = require('./audit.models'); // Importa el modelo de auditoría
const { DataTypes } = require("sequelize");

const Gps = db.define("gps", {
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
    field: "citizen_id",
    unique: true
  },
  
  latitud:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitud:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  gotAutomatic:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  createdBy:{
    type: DataTypes.UUID,
    references:{
      key: 'id',
      model: Users
    }
  }
});


// Hook para crear auditoría antes de la creación
Gps.beforeCreate(async (gps, options) => {
  await createAudit(gps, 'create');
});

// Hook para crear auditoría antes de la actualización
Gps.beforeUpdate(async (gps, options) => {
  await createAudit(gps, 'update');
});

// Función para crear el registro de auditoría
async function createAudit(gps, action) {
  const changedFields = gps.changed();

  if (changedFields.length > 0 || action === 'create') {
    const changedValues = {};
    changedFields.forEach(fieldName => {
      changedValues[fieldName] = gps[fieldName];
    });

    await Audit.create({
      tableName: 'gps',
      recordId: gps.citicenID, // Cambia esto según la propiedad que almacena el ID en Gps
      changedFields: changedValues,
      action: action,
    });
  }
}
// Hook para crear auditoría antes de la creación
Gps.beforeCreate(async (gps, options) => {
  await createAudit(gps, 'create');
});

// Hook para crear auditoría antes de la actualización
Gps.beforeUpdate(async (gps, options) => {
  await createAudit(gps, 'update');
});

// Función para crear el registro de auditoría
async function createAudit(gps, action) {
  const changedFields = gps.changed();

  if (changedFields.length > 0 || action === 'create') {
    const changedValues = {};
    changedFields.forEach(fieldName => {
      changedValues[fieldName] = gps[fieldName];
    });

    await Audit.create({
      tableName: 'gps',
      recordId: gps.citicenID, // Cambia esto según la propiedad que almacena el ID en Gps
      changedFields: changedValues,
      action: action,
    });
  }
}


module.exports = Gps