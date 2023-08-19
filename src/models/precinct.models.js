const db = require("../utils/database");
const Maps = require("./maps.models");

const { DataTypes } = require("sequelize");

const Precincts = db.define("precincts", {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique:true,
    primaryKey: true,
  },
  recintoNombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccionRecinto:{
  type: DataTypes.STRING,
  },
  latitud:{
  type: DataTypes.STRING,
  allowNull: true,
  },
  longitud:{
  type: DataTypes.STRING,
  allowNull: true,
  },
  electLocal:{
  type: DataTypes.INTEGER,
  },
  electExterior:{
  type: DataTypes.INTEGER,
  },
provincia:{
  type:DataTypes.INTEGER,
  references:{
    key: 'id',
    model: Maps
  }
},
municipio:{
  type:DataTypes.INTEGER,
  references:{
    key: 'id',
    model: Maps
  }
},

distrito:{
  type:DataTypes.INTEGER,

  allowNull:true
},
circunscripcion:{
  type:DataTypes.STRING
},
}, {
  //? Evita que sequelize cree la columna de createdAt y updatedAt
  timestamps: false
});

module.exports = Precincts