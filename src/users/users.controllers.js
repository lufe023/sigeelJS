//? Dependencies
const uuid = require('uuid')
const Census = require('../models/census.models')
const Roles = require('../models/roles.models')

const Users = require('../models/users.models')
const { hashPassword } = require('../utils/crypto')

const getAllUsers = async (offset, limit) => {
    const data = await Users.findAndCountAll({
        offset: offset,
        limit: limit,
        include :[
            
            {
            model : Census,
            attributes: ['first_name', 'last_name', 'picture'],
            as: 'usuario'
            },
            {
                model: Roles,
                attributes: ['level', 'roleName'],
                as: 'nivel'
            }
        ]
    })
    return data
}

const getUserById = async (id) => {
    const data = await Users.findOne({
        attributes:['id', 'email', 'role', 'status', 'citizenID'],
        where: {
            id: id,
            status: 'active'
        },
        include :[
        
                {
                    model: Census,
                    attributes: ['first_name', 'last_name'],
                    as: 'usuario'
            },
            {
                model: Roles,
                attributes: ['level', 'roleName'],
                as: 'nivel'
            }
        ]
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
const requestForgotPassword =async (email) => {
    const codigo = uuid.v4()
    const result = await Users.update({
        passwordRequest:codigo
    },
{
        where: {
            email
        }
    })
    return [result, codigo]
}
const changeForgotPassword = async (idRequest, data) => {
    const result = await Users.update({
        password:  hashPassword(data.newPassword),
        passwordRequest: null
    },
{
        where: {
            passwordRequest:idRequest
        }
    })
    return result
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
            //debo hacer una peticion a Census para pedir datos del usuario que estan en el padron
            // {
            //     model : Census,
            //     attributes: ['first_name', 'last_name', 'picture'],
            //     as: 'usuario'
            // },
            {
                model: Roles,
                attributes: ['level', 'roleName'],
                as: 'nivel'
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
    getUserByEmail,
    changeForgotPassword,
    requestForgotPassword

}