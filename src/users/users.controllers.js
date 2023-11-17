//? Dependencies
const uuid = require("uuid");
const Census = require("../models/census.models");
const Roles = require("../models/roles.models");
const {Op} = require("sequelize")
const Users = require("../models/users.models");
const { hashPassword } = require("../utils/crypto");

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
        attributes: ["id","first_name", "last_name", "picture", "celphone",],
      },
      {
        model: Roles,
      },
    ],
  });
  return data;
};

const getUserById = async (id) => {
  const data = await Users.findOne({
    attributes: ["id", "email", "userRoleId", "active", "censuCitizenID", "passwordRequest"],
    where: {
      id: id,
    },
    include: [
      //debo hacer una peticion a Census para pedir datos del usuario que estan en el padron
      {
        model: Census,
      },
      {
        model: Roles,
      },
    ],
  });
  return data;
};

const createUser = async (data) => {
  const newUser = await Users.create({
    id: uuid.v4(),
    email: data.email,
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
  })

return change
}

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
    }
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
    }
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
      status: "active",
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
  const censusData = await Census.findAndCountAll({
    limit: 4,
    where: {
      [Op.or]: {
        firstName: {
          [Op.iLike]: `%${findWord}%`,
        },
        lastName: {
          [Op.iLike]: `%${findWord}%`,
        },
        citizenID: {
          [Op.iLike]: `%${findWord}%`,
        },
        nickname: {
          [Op.iLike]: `%${findWord}%`,
        },
      },
    },
    include:[
    {
        model : Users,
        attributes: ['id', 'email'],
        as: 'colaborador'
    },
]
});

  return censusData;
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
  changeUserRoleController
};