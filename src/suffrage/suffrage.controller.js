const { Sequelize, Op } = require("sequelize");
const Suffrages = require("../models/suffrage.models");
const Census = require("../models/census.models");
const Users = require("../models/users.models");
const uuid = require("uuid");

const getPeopleWhoVotedController = async (collegeId, offset, limit) => {
  const whereCondition = {
    college: collegeId,
  };

  const data = await Census.findAndCountAll({
    where: whereCondition,
    order: [
      ["position", "ASC"],
      ["id", "ASC"],
    ],
    offset: offset,
    limit: limit,
    attributes: [
      "id",
      "firstName",
      "lastName",
      "nickname",
      "citizenID",
      "picture",
      "position",
      "outside",
      "celphone",
      "telephone",
      "otherPhone",
      "adress",
    ],
    include: [
      {
        model: Suffrages,
        as: "sufragio",
      },
      {
        model: Users,
        attributes: ["id", "email"],
        as: "leaders",
        include: [
          {
            model: Census,
            attributes: ["firstName"],
          },
        ],
      },
    ],
  });

  return data;
};

const createOrUpdateSuffrageController = async (citizenID, suffrageValue, registerBy) => {
    try {
    // Buscar el registro existente con el mismo citizenID
    const [suffrage, created] = await Suffrages.findOrCreate({
        where: { citizenID },
        defaults: {
        // Valores por defecto si el registro no existe
        id: uuid.v4(),
        suffrage: suffrageValue,
        registerBy,
        },
    });

    // Si el registro ya existía, actualizar suffrage y updatedAt
    if (!created) {
        await suffrage.update({
        suffrage: suffrageValue,
        });
    }

    return suffrage;
    } catch (error) {
    throw error;
    }
};

module.exports = {
    getPeopleWhoVotedController,
    createOrUpdateSuffrageController
};
