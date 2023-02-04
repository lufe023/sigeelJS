//? Dependencies
const uuid = require('uuid')
const Census = require('../models/census.models')

const Users = require('../models/users.models')
const { hashPassword } = require('../utils/crypto')

const getAllUsers = async () => {
    const data = await Users.findAll({
        where: {
            status: 'active'
        }
    })
    return data
}

const getUserById = async (id) => {
    const data = await Users.findOne({
        attributes:['id', 'email', 'role', 'status', 'citizenID'],
        where: {
            id: id,
            status: 'active'
        }
    })
    return data
}

const createUser = async (data) => {
    const newUser = await Users.create({
        id: uuid.v4(),
        email: data.email,
        password: hashPassword(data.password),
        citizenID: data.citizenID,
        role: data.role
    })
    return newUser
}

const updateUser = async (id, data) => {
    const result = await Users.update(data, {
        where: {
            id
        }
    })
    return result
}

const deleteUser = async (id) => {
    const data = await Users.destroy({
        where: {
            id
        }
    })
    return data
}

//? Un servidor contiene la API
//? Otro servidor contiene la Base de Datos

const getUserByEmail = async(email) => {
    //? SELECT * FROM users where email = 'sahid.kick@academlo.com'//
    const data = await Users.findOne({
        where: {
            email: email,
            status: 'active'
        },
        include :[
            {
                model : Census,
                attributes: ['first_name', 'last_name', 'picture'],
                as: 'usuario'
            }
        ]
    })
    return data
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail
}