//? Dependencies
const uuid = require("uuid");
const Census = require("../models/census.models");
const Roles = require("../models/roles.models");
const { Sequelize, Op } = require("sequelize");
const Users = require("../models/users.models");
const { hashPassword } = require("../utils/crypto");

require('dotenv').config();

const injectPictureUrl = (citizen) => {
    if (!citizen) return null;
    const c = citizen.toJSON ? citizen.toJSON() : { ...citizen };

    const province = c.province || 0;
    const municipality = c.municipality || 0;
    const precinct = c.PrecinctId || 0;
    const college = c.CollegeId || 0;
    const cedula = c.citizenID;

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    
    // Si la cédula no existe, no podemos construir una URL válida
    c.picture = cedula 
        ? `${baseUrl}/api/v1/images/pic/${province}/${municipality}/${precinct}/${college}/${cedula}`
        : null;
    
    return c;
};


//conseguir todos los usuarios que existan en el sistema
const getAllUsers = async (offset, limit) => {
    const data = await Users.findAndCountAll({
        offset: offset,
        limit: limit,
        attributes: {
            exclude: ["password"],
        },
        include: [
            {
                model: Census,
                attributes: [
                    "id",
                    "firstName", 
                    "lastName",
                    "picture",
                    "celphone",
                    "citizenID",
                    "municipality",
                    "province",   
                    "PrecinctId", 
                    "CollegeId"
                ],
            },
            {
                model: Roles,
            },
        ],
    });


const processedRows = data.rows.map(user => {
        const userJson = user.toJSON(); 
        
        // Usamos el nombre que confirmaste: "censu"
        if (userJson.censu) {
            userJson.censu = injectPictureUrl(userJson.censu);
        }
        return userJson;
    });

    return { count: data.count, rows: processedRows };
};

const getUserById = async (id) => {
    const data = await Users.findOne({
        attributes: [
            "id",
            "email",
            "userRoleId",
            "active",
            "censuCitizenID",
            "passwordRequest",
        ],
        where: {
            id: id,
        },
        include: [
            {
                model: Census,
            },
            {
                model: Roles,
            },
        ],
    });
if (!data) return null;

    const userJson = data.toJSON();
    
    // Aplicamos la lógica al campo "censu"
    if (userJson.censu) {
        userJson.censu = injectPictureUrl(userJson.censu);
    }
    
    return userJson;
};

const createUser = async (data) => {
    const newUser = await Users.create({
        id: uuid.v4(),
        email: data.email.toLowerCase(),
        password: hashPassword(data.password),
        censuCitizenID: data.citizenID.trim().replace(/-/g, ""),
        userRoleId: data.role,
    });
    return newUser;
};

const changeUserRoleController = async (id, newRole) => {
    const change = await Users.update(
        {
            userRoleId: newRole,
        },
        {
            where: {
                id,
            },
        },
    );

    return change;
};

const requestForgotPassword = async (email) => {
    const codigo = uuid.v4();
    const result = await Users.update(
        {
            passwordRequest: codigo,
        },
        {
            where: {
                email,
            },
        },
    );
    return [result, codigo];
};

const changeForgotPassword = async (idRequest, data) => {
    const result = await Users.update(
        {
            password: hashPassword(data.newPassword),
            passwordRequest: null,
        },
        {
            where: {
                passwordRequest: idRequest,
            },
        },
    );
    return result;
};

const updateUser = async (id, data) => {
    const result = await Users.update(data, {
        where: {
            id,
        },
    });
    return result;
};

const deleteUser = async (id) => {
    const data = await Users.destroy({
        where: {
            id,
        },
    });
    return data;
};

const getUserByEmail = async (email) => {
    //? SELECT * FROM users where email = 'sahid.kick@academlo.com'//
    const data = await Users.findOne({
        where: {
            email: email,
        },
        include: [
            {
                model: Roles,
            },
        ],
    });
    return data;
};

const findUserController = async (findWord) => {
    let looking = findWord.trim().replace(/-/g, "");

    const [firstName, ...lastNameParts] = looking.split(" ");
    const lastName = lastNameParts.join(" ");

    const censusData = await Census.findAndCountAll({
        limit: 5,
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { firstName: { [Op.iLike]: `%${firstName}%` } },
                        { lastName: { [Op.iLike]: `%${lastName}%` } },
                    ],
                },
                { citizenID: { [Op.iLike]: `%${looking}%` } },
                { nickname: { [Op.iLike]: `%${looking}%` } },
                { firstName: { [Op.iLike]: `%${looking}%` } },
                { lastName: { [Op.iLike]: `%${looking}%` } },
                { celphone: { [Op.iLike]: `%${looking}%` } },
                { telephone: { [Op.iLike]: `%${looking}%` } },
            ],
        },
        include: [
            {
                model: Users,
                as: "colaborador",
                required: true,
                include: [
                    {
                        model: Roles,
                    },
                ],
            },
        ],
    });
const processedRows = censusData.rows.map(citizen => injectPictureUrl(citizen));

    return { count: censusData.count, rows: processedRows };
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    changeForgotPassword,
    requestForgotPassword,
    findUserController,
    changeUserRoleController,
};
