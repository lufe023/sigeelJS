const Condition = require("../models/condition.models");
const uuid = require('uuid')

//create new condition
const createConditionController = async (citizenId,data) => {

  const newCondition = await Condition.create({
    id: uuid.v4(),
    citizenID: citizenId,
    conditionDetails: data.conditionDetails,
    dyslexia: data.dyslexia,
    visual: data.visual,
    auditory: data.auditory,
    motor: data.motor,
    cognitive: data.cognitive,
    outside: data.outside
  });
  return newCondition;

};

const getConditionByIdController = async (id) => {
  const condition = await Condition.findByPk(id);
  return condition;
};

const updateConditionController = async (id, data) => {
  const result = await Condition.update(data, {
    where: {
      citizenID: id,
    },
  });
  return result;
};

const deleteConditionController = async (id) => {
  const result = await Condition.destroy({
    where: {
      citizenID: id,
    },
  });
  return result;
};

module.exports = {
  createConditionController,
  getConditionByIdController,
  updateConditionController,
  deleteConditionController,
};
