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

  //conseguir una tarea por id
  const getTaskById = (req, res) => {
    const taskid = req.params.id;
    const userId = req.user.id
    todoControllers
      .getTaskById(taskid, userId)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(404).json({ message: err.message });
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
            Error: err
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


  const patchTask = (req, res) => {
    const taskId = req.params.id
    const userid = req.user.id
    
    const {title, description, limit, isActive } = req.body;
  
    todoControllers
      .updateTask(userid, taskId, { title, description, limit, isActive})
      .then((data) => {
        if (data[0]) {
          res
            .status(200)
            .json({ message: `Task with ID: ${taskId}, has edited succesfully!` });
        } else {
          res.status(404).json({ message: "Invalid ID" });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  };



  module.exports = {
    getAlltasks,
    createTask,
    getTaskById,
    patchTask
  } 