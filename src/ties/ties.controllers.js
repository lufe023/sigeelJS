const uuid = require('uuid')
const Census = require("../models/census.models");
const Ties = require('../models/ties.models')
const {Op} = require("sequelize");
const TiesTypes = require('../models/tiesTypes.models');
const College = require('../models/college.models');
const Precincts = require('../models/precinct.models');
const Users = require('../models/users.models');
const { injectPictureUrl: getPictureUrl } = require('../utils/injecPictureUrl');

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
const getPeoplesTiesByCitizenIdController = async (citizenID) => {
    const ties = await Ties.findAndCountAll({
        where: {
            [Op.or]: [ // Corregido: Op.or espera un array en versiones recientes de Sequelize
                { aCiticenID: citizenID },
                { bCiticenID: citizenID }
            ]
        },
        include: [
            {
                model: Census,
                as: 'aties',
                include: [
                    { model: College, as: 'colegio', include: [{ model: Precincts, as: 'precinctData' }] },
                    { 
                        model: Users, as: 'leaders', 
                        include: [{ model: Census }] // Si el líder necesita foto, se inyecta aquí también
                    }
                ]
            },
            {
                model: Census,
                as: 'bties',
                include: [
                    { model: College, as: 'colegio', include: [{ model: Precincts, as: 'precinctData' }] }
                ]
            },
            {
                model: TiesTypes,
                as: 'tieType'
            }
        ]
    });

    // Inyectamos las fotos en los ciudadanos A y B de cada relación
    const processedRows = ties.rows.map(tie => {
        const t = tie.toJSON();
        if (t.aties) t.aties = injectPictureUrl(t.aties);
        if (t.bties) t.bties = injectPictureUrl(t.bties);
        return t;
    });

    return {
        count: ties.count,
        rows: processedRows
    };
};

//lista de tipos de enlaces
const getAllTieTypesController = async () => {
    const types = await TiesTypes.findAndCountAll();

    const typesWithPictures = types.rows.map((type) => injectPictureUrl(type));

    return {
        count: types.count,
        rows: typesWithPictures,
    };
};

const injectPictureUrl = (citizen) => {
    if (!citizen) return null;

    const c = citizen.toJSON ? citizen.toJSON() : { ...citizen };

    c.picture = getPictureUrl({
        province: c.province,
        municipality: c.municipality,
        precinct: c.PrecinctId,
        college: c.CollegeId,
        citizenID: c.citizenID
    });

    return c;
};

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