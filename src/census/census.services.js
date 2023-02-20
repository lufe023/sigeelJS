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

module.exports = {
    getAllCensus,
    findPeople
}