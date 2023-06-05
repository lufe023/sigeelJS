const Todo = require('../models/todo.models')
const uuid = require('uuid')
const {Op, and} = require("sequelize")
const Users = require('../models/users.models')

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
                },
                {
                    model:Users,
                    as: 'Creador',
                    attributes: ['email'],
                }
            ]
    })
    return data
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
                },
                {
                    model:Users,
                    as: 'Creador',
                    attributes: ['email'],
                }
            ]
    })
    return data
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