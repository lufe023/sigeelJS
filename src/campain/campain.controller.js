const Campain = require('../models/campain.models')
const Maps = require('../models/maps.models')
const Polls = require('../models/poll.models')
const uuid = require('uuid')
const CensusControllers =  require('../census/census.controller')
const { Op, Sequelize } = require("sequelize");
const sequelize = require('../utils/database');

const getAllCampains = async () => {
    const campains = await Campain.findAll({
        attributes: {
            include: [
                [Sequelize.literal('(SELECT COUNT(*) FROM Polls WHERE Polls.campain = Campain.id)'), 'encuestasCount'],
                [Sequelize.literal('(SELECT COUNT(*) FROM Polls WHERE Polls.campain = Campain.id AND (prefered_party IS NOT NULL OR elector_type IS NOT NULL OR president IS NOT NULL OR senator IS NOT NULL OR diputy IS NOT NULL OR mayor IS NOT NULL OR councillor IS NOT NULL OR "districtDirector" IS NOT NULL OR "districtCouncilor" IS NOT NULL ))'), 'pollWithAnyComplete'],

            ]
        },
        include: [
            {
                model: Maps,
                as: 'provinces'
            },
            {
                model: Maps,
                as: 'municipalities'
            }
        ]
    });

    return campains;
}

const createPools = async(data) => {
    const poll = await Polls.create({
        id: uuid.v4(),
        citizenID: data.citizenID,
        campain: data.campain,
    })
    return poll
}

const createCampains = async (data) =>

{

    try {
        const newCampain = await Campain.create({
            id: uuid.v4(),
            name: data.name,
            details: data.details,
            municipio: data.municipio,
            provincia: data.provincia,
            createdBy: data.createdBy,
            startAt: data.startAt,
            finishAt: data.startAt,
            active:data.isActive
        })
        

        const peoples = await  CensusControllers.getPeoplesByPlaces(data.provincia, data.municipio)
        
        // //const tareas = []
        const pools = []
            for(let i=0; i<peoples.count; i++)
            {
                
                
                let pool = await createPools({
                    citizenID: peoples.rows[i].citizenID,
                    campain: newCampain.id,
                    active:true
                })
                pools.push(pool)
                
            }
        
        return [peoples]

    } catch (err) {
        return err
    }
}


const activeCampainController = async (id, active) => {
    const campainId = id;
    const transaction = await sequelize.transaction();
    try {
        // Desactivar la campaña en la tabla Campain
        await Campain.update(
            { active: active, isActive:active },
            {
                where: {
                    id: campainId
                },
                transaction
            }
        );

        // Desactivar todos los Polls asociados a la campaña en la tabla Polls
        await Polls.update(
            { active: active },
            {
                where: {
                    campain: campainId
                },
                transaction
            }
        );

        // Confirmar la transacción
        await transaction.commit();

        return { success: true, message: 'Campaña y encuestas actualizadas exitosamente.' };
    } catch (error) {
        // Si ocurre un error, deshacer la transacción
        await transaction.rollback();

        return { success: false, message: 'Error al actualizar campaña y encuestas.' };
    }
};

module.exports = {
    getAllCampains,
    createCampains,
    activeCampainController
}