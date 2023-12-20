const censusControllers = require('./census.controller');
const { host } = require('../config')
const userController = require('../users/users.controllers')

const getAllCensus = (req, res) => {
    censusControllers
    .getAllCensus()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({err});
    });
};

const getMyPeople = (req, res) => {
  const leaderId = req.user.id
  censusControllers
  .getMyPeople(leaderId)
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    res.status(400).json({ message: err });
  });
};

const getPeopleByUser = (req, res) => {
  const leaderId = req.body.leaderId
  censusControllers
  .getPeopleByUser(leaderId)
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    res.status(400).json({ message: err });
  });
};

const getOnePeople = (req, res) => {
  const peopleId = req.params.id
  censusControllers
  .getOnePeople(peopleId)
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    res.status(400).json({ message: err });
  });
};


const findPeople = (req, res) => {
  
  const findWord = req.body.findWord
  
  if(findWord){
  
  censusControllers
  .findPeople(findWord)
  .then((data) => {
    res.status(200).json({
      data,
    busqueda:findWord });
  })
  .catch((err) => {
    res.status(400).json({ message: err});
  });
  }else{
    res.status(400).json({
      message: 'busqueda vacia',
      field: 'findWord' });
  }
  
}

const simpleFindPeople = (req, res) => {
  
  const findWord = req.body.findWord
  
  if(findWord){
  
  censusControllers
  .simpleFindPeople(findWord)
  .then((data) => {
    res.status(200).json({
      data,
    busqueda:findWord });
  })
  .catch((err) => {
    res.status(400).json({ message: err});
  });
  }else{
    res.status(400).json({
      message: 'busqueda vacia',
    field: 'findWord' });
  }
  
}

const addPeople = (req, res)=>{
  const leaderId = req.user.id
  const peopleId = req.body.peopleId

  if(peopleId){
  censusControllers
  .addPeople(peopleId, leaderId)
  .then((result) => {
    if (result[0]) {
      res
        .status(200)
        .json({ message: `Persona agregada de forma exitosa` });
    } else {
      res.status(404).json({ message: "esta peticion no es valida" });
    }
  })

  .catch((err) => {
    res.status(400).json({ message: err.message });
  });
  
}else{
  res.status(400).json({ message: "Se debe enviar peopleId de tipo UUID"});
}

}

const addPeopleToOtherUser = (req, res)=>{
  const leaderId = req.body.leaderId
  const peopleId = req.body.peopleId

  if(peopleId && leaderId){
  censusControllers
  .addPeople(peopleId, leaderId)
  .then((result) => {
    if (result[0]) {
      res
        .status(200)
        .json({ message: `Persona agregada de forma exitosa` });
    } else {
      res.status(404).json({ message: "esta peticion no es valida" });
    }
  })

  .catch((err) => {
    res.status(400).json({ message: err.message });
  });
  
}else{
  res.status(400).json({ message: "Se debe enviar peopleId de tipo UUID"});
}

}


const removePeople = (req, res)=>{
  const leaderId = req.body.leaderId
  const peopleId = req.body.peopleId

  if(peopleId && leaderId){
  censusControllers
  .removePeople(peopleId, leaderId)
  .then((result) => {
    if (result[0]) {
      res
        .status(200)
        .json({ message: `Accion exitosa` });
    } else {
      res.status(404).json({ message: "esta peticion no es valida" });
    }
  })
  .catch((err) => {
    res.status(400).json({ message: err.message });
  });
  
}else{
  res.status(400).json({ message: "Se debe enviar peopleId y leaderid ambas de tipo UUID"});
}

}

const updatePeopleService = (req, res)=>{
  const citizenID = req.params.citizenID
  const data = req.body

  if(data){
  censusControllers
  .updatePeopleController(data,citizenID)
  .then((result) => {res.status(200).json({ message: `Actualización exitosa`, data: result });
  })

  .catch((err) => {res.status(400).json(err)});
  
}else{
  res.status(400).json({ message: "Se debe enviar la cedula en la peticion"});
}

}


const getPendingUpdatesService  = (req,res) => {

  const citizenId = req.params.citizenId

  censusControllers.getPendingUpdatesController(citizenId)
  .then((result) => {res.status(200).json(result)})
  .catch((err) => {res.status(400).json(err)});
}

const getAllCensusByCollegeService  = (req,res) => {

  const collegeId = req.params.collegeId

    // variable para incluir o no personas del exterior
    const includeExterior = req.query.includeExterior || false; 

    //donde inicia 
    const offset = Number(req.query.offset) || 0

    //capacidad maxima
    const limit =  Number(req.query.limit) || 10

    const urlBase = `${host}/api/v1/census/colegio/${collegeId}`

  censusControllers.getAllCensusByCollegeController(collegeId, offset, limit, includeExterior)
  .then(data => {
    const nexPage = data[0].count - offset >= limit ? `${urlBase}?offset=${offset + limit} &limit=${limit}`: null;
    const prevPage = offset - limit >= 0 ? `${urlBase}?offset=${offset-limit}&limit=${limit}` : null
    res.status(200).json({
      next: nexPage,
      prev: prevPage,
      offset,
      limit,
      includeExterior:includeExterior,
      precinctData: data[1],
      count: data[0].count,
      results: data[0].rows});
  })
  .catch((err) => {res.status(400).json(err)});
}

const getPeoplesByPlacesServices = (req, res) => {
  censusControllers
  .getPeoplesByPlaces(province, municipality, district)
  .then((result) => {res.status(200).json(result)})
  .catch((err) => {res.status(400).json(err)});

}

//servicio para transferir un padron a otro usuario
const transferCensusService = (req, res) => {

  const {leaderIdA, leaderIdB} = req.body
  if(leaderIdA && leaderIdB){
    userController.getUserById(leaderIdA)
.then((userA) => {
  if(userA.active){
    res.status(400).json({message: "El usuario donador debe estar desactivado para poder donar el padroncillo"})
  }else{
    censusControllers.transferCensusController(leaderIdA, leaderIdB)
.then((data) => {res.status(200).json(data)})
.catch((err) => {res.status(400).json(err)});
  }
})
  }else{
    res.status(400).json({message: "Se deben elegir dos usuarios para que ocurra la trasferencia"})
  }
}

module.exports = {
    getAllCensus,
    findPeople,
    simpleFindPeople,
    getMyPeople,
    getPeopleByUser,
    getOnePeople,
    addPeople,
    removePeople,
    updatePeopleService,
    getPendingUpdatesService,
    getAllCensusByCollegeService,
    addPeopleToOtherUser,
    transferCensusService
}