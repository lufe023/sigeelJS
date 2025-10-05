const Maps = require("../models/maps.models");
const Provincia = require("../models/provincia.models");
const Municipio = require("../models/municipio.models");

const getAllMaps = async () => {
    const provinceResult = await Provincia.findAndCountAll({});
    const municipalityResult = await Municipio.findAndCountAll({});

    const provincesWithID = provinceResult.rows.map((prov) => {
        return {
            ...prov.get({ plain: true }),
            type: "province",
        };
    });

    const municipalitiesWithID = municipalityResult.rows.map((muni) => {
        return {
            ...muni.get({ plain: true }),
            type: "municipality",
        };
    });

    const data = [...provincesWithID, ...municipalitiesWithID];
    return data;
};
const createNewMap = async (data) => {
    const newMap = await Maps.create({
        name: data.name,
        parent: data.parent,
        type: data.type,
    });
    return newMap;
};

module.exports = {
    getAllMaps,
    createNewMap,
};
