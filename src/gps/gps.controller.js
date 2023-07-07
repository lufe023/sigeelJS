const Census = require('../models/census.models');
const Gps = require('../models/gps.models')
const {Op} = require("sequelize");


const getCitizensNearby = async (citizenID) => {
    try {
      const referenceGps = await Gps.findOne({ where: { citicenID: citizenID } });
  
      if (!referenceGps) {
        return []; // Si no se encuentra el GPS de la persona de referencia, retornar un arreglo vacío
      }
  
      const nearbyGpsList = await Gps.findAll({
        where: {
          id: { [Op.not]: referenceGps.id }, // Excluir el GPS de la persona de referencia
          latitud: { [Op.ne]: null }, // Filtrar solo aquellos con latitud no nula
          longitud: { [Op.ne]: null }, // Filtrar solo aquellos con longitud no nula
        },
        include: [{
          model: Census,
          as: 'citizen',
        }],
      });
  
      const nearbyCitizens = nearbyGpsList.filter((gps) => {
        const distance = calculateDistance(
          referenceGps.latitud,
          referenceGps.longitud,
          gps.latitud,
          gps.longitud
        );
        return distance <= 500; // Filtrar aquellos dentro del radio de 500 metros
      });
  
      const nearbyCitizenData = nearbyCitizens.map((gps) => {
        const { citizenID, latitud, longitud, citizen } = gps;
        return {
          citizenID,
          latitud,
          longitud,
          censusData: citizen,
        };
      });
  
      return nearbyCitizenData;
    } catch (error) {
      throw new Error("Error retrieving nearby citizens: " + error.message);
    }
  };
  
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radio de la Tierra en kilómetros
  
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
  
    // Convertir las coordenadas a radianes
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);
  
    // Calcular la distancia utilizando la fórmula de Haversine
    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c * 1000; // Convertir la distancia a metros
  
    return distance;
  }

module.exports = { getCitizensNearby };

