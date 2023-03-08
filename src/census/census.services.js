const censusControllers = require('./census.controller');

const getAllCensus = (req, res) => {
    censusControllers
    .getAllCensus()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ message: err });
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
module.exports = {
    getAllCensus,
    findPeople,
    getMyPeople,
    getOnePeople,
    addPeople,
    removePeople
}