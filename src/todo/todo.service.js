const todoControllers = require('./todo.controller')

const getAlltasks = (req, res) => {
  const id = req.user.id
    todoControllers
      .getAlltasks(id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  };

  const createTask = (req, res) => {
    const {
      title,
      description,
      limit,
      isActive,
      responsible
      } = req.body
      
      const createdBy =req.user.id

      if(title && description && limit && responsible)
      {
        todoControllers.createTask({
        title,
        description,
        limit,
        isActive,
        responsible,
        createdBy
        })
        .then((data) => {
          res.status(201).json(data);
        })
        .catch((err) => {
          res.status(400).json({
            test: createdBy,
            Error: err.message
          });
        });
    } else {
      //? Error cuando no mandan todos los datos necesarios para crear un usuario
      res.status(400).json({
        message: "All fields must be completed",
        fields: {
          title: "string",
          description: "text",
          limit: "Datetime",
          isActive: "bool",
          responsible: "uuid"
        },
      })
    }
  }

  module.exports = {
    getAlltasks,
    createTask
  } 