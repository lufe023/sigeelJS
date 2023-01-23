const Todo = require('../models/todo.models')
const uuid = require('uuid')
const {Op} = require("sequelize")

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
            }
    })
    return data
}

module.exports = {
    createTask,
    getAlltasks
}