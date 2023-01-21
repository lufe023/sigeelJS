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

module.exports = {
    getAllCensus
}