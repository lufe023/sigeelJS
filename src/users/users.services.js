const { enviarMail } = require("../utils/mails/sendEmail");
const usersControllers = require("./users.controllers");
const { host } = require('../config')

const getAllUsers = (req, res) => {

  //donde inicia 
  const offset = Number(req.query.offset) || 0

  //capacidad maxima
  const limit =  Number(req.query.limit) || 10

  const urlBase = `${host}/api/v1/users`



  usersControllers
    .getAllUsers(offset, limit)
    .then((data) => {
      const nexPage = data.count - offset >= limit ? `${urlBase}?offset=${offset + limit}&limit=${limit}` : null
      res.status(200).json({
        next: nexPage,
        prev: `${urlBase}`,
        offset,
        limit,
        count: data.count,
        results: data.rows});
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

const getUserById = (req, res) => {
  const id = req.params.id;
  usersControllers
    .getUserById(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
};

const registerUser = (req, res) => {
  const {
    email,
    password,
    citizenID,
    role
  } = req.body;

  if (email && password && citizenID && role) {
    //? Ejecutamos el controller
    usersControllers.createUser({
        email,
        password,
        citizenID,
        role
      })
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        res.status(400).json(err.message);
      });
  } else {
    //? Error cuando no mandan todos los datos necesarios para crear un usuario
    res.status(400).json({
      message: "All fields must be completed",
      fields: {
        email: "example@example.com",
        password: "string",
        citizenID: "el id del ciudadano, cedula",
      },
    });
  }
};

const requestForgotPassword = (req, res)=> {

usersControllers
.requestForgotPassword(req.body.email)
.then((data)=>{
if(data[0]!=0){
  res.status(201).json({message: "Peticion enviada",
})
let bodyEmail = `Se ha hecho una peticion para recuperar la contraseña del Sistema de Gestion del Elector haga Click En el siguiente enlace para recuperar su contraseña <a href='http://127.0.0.1:5173/#/recoverypassword/${data[1]}'>Recuperar Contraseña</a>  `

enviarMail('no-reply@sigeel.com', req.body.email,'Recuperacion de Contraseña' , "la recuperacion se envio", bodyEmail)
}
else{
  res.status(400).json({message: "Esta petición no pudo ser procesada",})
}
})
.catch((err) => {
  res.status(400).json({ message: err.message });
});
}


const changeForgotPassword = (req, res) => {
  const idRequest = req.params.idRequest;
  
  const { newPassword, confirmNewPassword } = req.body;

  if(confirmNewPassword &&newPassword ){
if(confirmNewPassword===newPassword){
  usersControllers
    .changeForgotPassword(idRequest, {newPassword})
    .then((data) => {
      if (data[0]) {
        res
          .status(200)
          .json({ message: `Contraseña cambiada ssatisfactoriamente` });
      } else {
        res.status(404).json({ message: "esta peticion no es valida" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
  }else{
    res.status(400).json({ message: "Las contraseñas no coinciden"});
  }}else{
    res.status(400).json({ 
      message: "Debe enviar todas las celdas",
      fields: {
        confirmNewPassword: 'string',
        newPassword: 'string'
      }
     });
  }
};

const patchUser = (req, res) => {
  const id = req.params.id;
  
  const { firstName, lastName, phone, gender, country } = req.body;

  usersControllers
    .updateUser(id, { firstName, lastName, phone, gender, country })
    .then((data) => {
      if (data[0]) {
        res
          .status(200)
          .json({ message: `User with ID: ${id}, edited succesfully!` });
      } else {
        res.status(404).json({ message: "Invalid ID" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

const deleteUser = (req, res) => {
  const id = req.params.id;
  usersControllers
    .deleteUser(id)
    .then((data) => {
      if (data) {
        res.status(204).json();
      } else {
        res.status(404).json({ message: "Invalid ID" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

//? My user services

const getMyUser = (req, res) => {
  const id = req.user.id; //? req.user contiene la informacion del token desencriptado

  usersControllers
    .getUserById(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

// TODO crear rutas protegidas /me, con los verbos para update y delete

const patchMyUser = (req, res) => {
  const id = req.user.id;
  const { firstName, lastName, phone, birthday, gender, country } = req.body;

  usersControllers
    .updateUser(id, { firstName, lastName, phone, birthday, gender, country })
    .then(() => {
      res.status(200).json({ message: `Your user was edited succesfully!` });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

//? 2 tipos de delete:
//* 1. por administrador
//* 2. por mi mismo

const deleteMyUser = (req, res) => {
  const id = req.user.id;

  usersControllers.updateUser(id, { status: "inactive" })
      .then(() => {
        res.status(200).json({ message: `Your user was deleted succesfully!` });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
};

module.exports = {
  getAllUsers,
  getUserById,
  patchUser,
  registerUser,
  deleteUser,
  getMyUser,
  patchMyUser,
  deleteMyUser,
  changeForgotPassword,
  requestForgotPassword
};
