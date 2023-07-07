const Condition = require("../models/condition.models");
const uuid = require('uuid');
const Participation = require("../models/participation.models");
const Benefit = require("../models/benefit.models");
const Job = require("../models/job.models");

//condition controller

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

//participation controller
const addParticipationController = async (citicenID,activityDescription,receiveAt)=> {

  const newPartitipacion = await Participation.create({
    id: uuid.v4(),
    citicenID,
    activityDescription,
    receiveAt
  })

  return newPartitipacion
}

const deleteParticipationController = async (activityId) =>{
  const deleteParticipation = await Participation.destroy({
    where:{
      id:activityId
    }
  })

  return deleteParticipation
}

//benefit controller
const addBeneficitController = async (citicenID,benefitDescription,receiveAt)=> {

  const newBenefit = await Benefit.create({
    id: uuid.v4(),
    citicenID,
    benefitDescription,
    receiveAt
  })

  return newBenefit
}

const deleteBenefitController = async (benefitId) =>{
  const deleteBenefit = await Benefit.destroy({
    where:{
      id:benefitId
    }
  })

  return deleteBenefit
}

//job controller 
const addJobController = async (citicenID,institution, position, positionDetails, startedAt, finishAt)=> {

  const newJob = await Job.create({
    id: uuid.v4(),
    citicenID,
    institution,
    position,
    positionDetails,
    startedAt,
    finishAt
  })

  return newJob
}

const deleteJobController = async (JobId) =>{
  const deleteJob = await Job.destroy({
    where:{
      id:JobId
    }
  })

  return deleteJob
}


module.exports = {
  createConditionController,
  getConditionByIdController,
  updateConditionController,
  deleteConditionController,
  addParticipationController,
  deleteParticipationController,
  addBeneficitController,
  deleteBenefitController,
  addJobController,
  deleteJobController
};
