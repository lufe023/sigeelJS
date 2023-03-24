const db = require("../utils/database");
const Census = require('./census.models')
const Ballot = require("./ballot.models");
const Campain = require("./campain.models");

const { DataTypes } = require("sequelize");

const Poll = db.define("poll", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  
  citizenID:{
    type: DataTypes.STRING,
    allowNull: false,
    references:{
      key: 'citizen_id',
      model: Census
    },
    field: 'citizen_id'
  },
  campain:{
    type: DataTypes.UUID,
    allowNull: false,
    references:{
      key: 'id',
      model: Campain
    },
  },

  preferedParty: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'prefered_party'
  },
  electorType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'elector_type'
  },
  president:{
    type: DataTypes.UUID,
    references:{
      key: 'candidate_id',
      model: Ballot
    }
  },
  senator:{
    type: DataTypes.UUID,
    references:{
      key: 'candidate_id',
      model: Ballot
    }
  },
  diputy:{
    type: DataTypes.UUID,
    references:{
      key: 'candidate_id',
      model: Ballot
    }
  },
  mayor:{
    type: DataTypes.UUID,
    references:{
      key: 'candidate_id',
      model: Ballot
    }
  },
  councillor:{
    type: DataTypes.UUID,
    references:{
      key: 'candidate_id',
      model: Ballot
    }
  },
  alreadyVoted:{
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false
  }
});

module.exports = Poll