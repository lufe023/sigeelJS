const Todo = require('../models/todo.models')
const uuid = require('uuid')
const {Op, and} = require("sequelize")
const Users = require('../models/users.models')
const Census = require('../models/census.models')
const { injectPictureUrl } = require('../utils/injecPictureUrl');

const createTask = async (data) => {
    const newTask = await Todo.create({
        id: uuid.v4(),
        title: data.title,
        description: data.description,
        limit: data.limit,
        isActive: data.isActive,
        responsible: data.responsible,
        createdBy: data.createdBy,

    })
    return newTask
}

const getAlltasks = async (id) => {
    const data = await Todo.findAll({
        where: {
            [Op.or]: [
                { responsible: id },
                { createdBy: id }
            ]
            },
            include:[
                {
                    model:Users,
                    as: 'Responsible',
                    attributes: ['email'],
                    include:[
                        {
                            model:Census,
                            as: 'censu',
                            attributes: [
                             
                                'lastName',
                                'picture',
                                'id',
                                'firstName',
                                'province',
                                'municipality',
                                'PrecinctId',
                                'CollegeId',
                                'citizenID',
                            ],
                        }
                    ]
                },
                {
                    model:Users,
                    as: 'Creador',
                    attributes: ['email'],
                }
            ]
    })
    // Inyectar URL de imagen para cada tarea (si existe Census)
    const result = data.map((task) => {
        const t = task.toJSON ? task.toJSON() : { ...task };
        if (t.Responsible && (t.Responsible.censu || t.Responsible.Census)) {
            const c = t.Responsible.censu || t.Responsible.Census;
            c.picture = injectPictureUrl({
                province: c.province,
                municipality: c.municipality,
                precinct: c.PrecinctId,
                college: c.CollegeId,
                citizenID: c.citizenID || c.id,
            });
        }
        return t;
    });

    return result
}

const getTaskById = async (taskid, userid) => {
    const data = await Todo.findAll({
        where: {
            [Op.or]: [
                { responsible: userid },
                { createdBy: userid }
            ],
            [Op.and]:[
                {
                id: taskid}
            ]
            },
            include:[
                {
                    model:Users,
                    as: 'Responsible',
                    attributes: ['email'],
                    include:[
                        {
                            model:Census,
                            as: 'censu',
                            attributes: [
                                'firstName',
                                'lastName',
                                'picture',
                                'id',
                                
                                'province',
                                'municipality',
                                'PrecinctId',
                                'CollegeId',
                                'citizenID',
                            ],
                        }
                    ]
                },
                {
                    model:Users,
                    as: 'Creador',
                    attributes: ['email'],
                }
            ]
    })
    // Inyectar URL de imagen en el objeto Census (soporte para alias 'censu' y 'Census')
    const result = data.map((task) => {
        const t = task.toJSON ? task.toJSON() : { ...task };
        if (t.Responsible && (t.Responsible.censu || t.Responsible.Census)) {
            const c = t.Responsible.censu || t.Responsible.Census;
            c.picture = injectPictureUrl({
                province: c.province,
                municipality: c.municipality,
                precinct: c.PrecinctId,
                college: c.CollegeId,
                citizenID: c.citizenID || c.id,
            });
        }
        return t;
    });

    return result
}


const updateTask = async (userid, taskId, data) => {
    const result = await Todo.update(data, {
        where: {
            [Op.or]: [
                { responsible: userid },
                { createdBy: userid }
            ],
            [Op.and]:[
                {
                id: taskId}
            ]
            }
    })
    return result
}

module.exports = {
    createTask,
    getAlltasks,
    getTaskById,
    updateTask
} 