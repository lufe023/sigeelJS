const Polls = require("../models/poll.models");
const Campain = require("../models/campain.models");
const uuid = require("uuid");
const Maps = require("../models/maps.models");
const CensusControllers = require("../census/census.controller");
const todoControllers = require("../todo/todo.controller");
const Census = require("../models/census.models");
const Ballot = require("../models/ballot.models");

const { Op } = require("sequelize");
const Parties = require("../models/parties.models");

const getAllPolls = async () => {
    const data = await Polls.findAll({});
    return data;
};

const createPools = async (data) => {
    const poll = await Polls.create({
        id: uuid.v4(),
        citizenID: data.citizenID,
        campain: data.campain,
    });
    return poll;
};

//actualizacion de los datos de una ecuesta por id que pertenece a un elector
const updatePollController = async (pollId, data) => {
    const poll = await Polls.update(data, {
        where: {
            id: pollId,
        },
    });
    return poll;
};

const getPollById = async (id) => {
    const poll = await Polls.findOne({
        where: {
            id,
        },
        attributes: { exclude: ["password"] },
        include: [
            //debo hacer una peticion a Census para pedir datos del usuario que estan en el padron
            {
                model: Census,
                as: "citizen",
            },
            {
                model: Campain,
                as: "Campain",
            },
        ],
    });

    const candidate = await Ballot.findAndCountAll({
        where: {
            [Op.and]: [
                { provincia: poll.Campain.provincia },
                { municipio: poll.Campain.municipio },
                //{distritoMunicipal: poll.Campain.distritoMunicipal}
            ],
        },
        include: [
            //debo hacer una peticion a Census para pedir datos del usuario que estan en el padron
            {
                model: Parties,
                as: "partyDetails",
            },
        ],
    });

    const parties = await Parties.findAndCountAll();

    const resultado = [
        poll,
        { availablesCandidates: candidate },
        { parties: parties },
    ];
    return resultado;
};

module.exports = {
    getAllPolls,
    getPollById,
    updatePollController,
    createPools,
};
