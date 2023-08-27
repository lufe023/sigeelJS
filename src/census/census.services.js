const censusControllers = require('./census.controller');

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

  censusControllers.getAllCensusByCollegeController(collegeId)
  .then((result) => {res.status(200).json(result)})
  .catch((err) => {res.status(400).json(err)});
}

const getPeoplesByPlacesServices = (req, res) => {
  censusControllers
  .getPeoplesByPlaces(province, municipality, district)
  .then((result) => {res.status(200).json(result)})
  .catch((err) => {res.status(400).json(err)});

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
    getAllCensusByCollegeService
}