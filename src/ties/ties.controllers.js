
const uuid = require('uuid')
const Census = require("../models/census.models");
const Ties = require('../models/ties.models')
const {Op} = require("sequelize");
const TiesTypes = require('../models/tiesTypes.models');
const College = require('../models/college.models');
const Precincts = require('../models/precinct.models');


//crear una nueva relacion
const newTiesController = async (aCiticenID, bCiticenID, tiesType)=> {
    /*se deben recibir 3 variables, el id del usuario al que se le crea la
    relacion el id del usuario con el que tiene la relacion y el id del 
    tipo de relacion */

    return [tie, created] = await Ties.findOrCreate({
        where: {
            aCiticenID,
            bCiticenID
        },
        defaults: {
            id: uuid.v4(),
            aCiticenID,
            bCiticenID,
            ties:tiesType
        },
    })
} 

//conseguir las relaciones entre personas
const getPeoplesTiesByCitizenIdController = async (citizenID)=> {

    const ties = await Ties.findAndCountAll({
    
        where:
        {
        [Op.or]:
            {
                aCiticenID: citizenID,
                bCiticenID: citizenID,
            }
        },
        include:[
            {
                model: Census,
                as: 'aties'
            },
            {
                model: Census,
                as: 'bties',
                include: [
                {
                    model: College,
                    as: 'colegio',
                    include: [
                        {
                        model: Precincts,
                        as: 'precinctData', // Usar el nombre del alias en la relación
                        }
                    ]
                },
            ]
            },
            {
                model: TiesTypes,
                as: 'tieType'
            }
        ]
    })
    
    return ties
    }

//lista de tipos de enlaces
const getAllTieTypesController = async () => {
    const types = await TiesTypes.findAndCountAll()
    return types
}

//lista de tipos de enlaces
const getTieById = async (id) => {
    const tie = await Ties.findOne({
        where:{id}
    })
    return tie
}

const deleteTieController = async (id)=>{
    const deleteTie = await Ties.destroy({
        where:{
          id:id
        }
      })
      return deleteTie
}

module.exports = {
    newTiesController,
    getPeoplesTiesByCitizenIdController,
    getAllTieTypesController,
    deleteTieController,
    getTieById
}