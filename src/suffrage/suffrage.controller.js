const { Sequelize, Op } = require('sequelize');
const Suffrages = require('../models/suffrage.models')
const Census = require('../models/census.models') 
const Users = require('../models/users.models')

const getPeopleWhoVotedController = async (collegeId, offset, limit) => {
    const whereCondition = {
        college: collegeId,
    };

    const data = await Census.findAndCountAll({
        where: whereCondition,
        order: [['position', 'ASC'], ['id', 'ASC']],
        offset: offset,
        limit: limit,
        attributes:["id","firstName","lastName","nickname","citizenID","picture", "position", "outside", "celphone","telephone", "otherPhone","adress"],
        include: [
            {
                model: Suffrages,
                as: 'sufragio',
            },
            {
                model: Users,
                attributes: ['id', 'email'],
                as: 'leaders',
                include: [
                    {
                        model: Census,
                        attributes: ['firstName'],
                    }
                ]
            },
        ]
    });

    return data;
}

//primera opcion 
// const getPeopleWhoVotedController = async (collegeId, offset, limit) => {
//     const whereCondition = {
//         college: collegeId,
//     };

//     const data = await Census.findAndCountAll({
//         where: whereCondition,
//         order: [['position', 'ASC'], ['id', 'ASC']],
//         offset: offset,
//         limit: limit,
//         include: [
//             {
//                 model: Suffrages,
//                 as: 'sufragio',
//                 where: {
//                     [Op.or]: [{ suffrage: false }, { suffrage: null }],
//                 },
//             },
//             {
//                 model: Users,
//                 attributes: ['id', 'email'],
//                 as: 'leaders',
//                 include: [
//                     {
//                         model: Census,
//                         attributes: ['firstName'],
//                     }
//                 ]
//             },
//         ]
//     });

//     return data;
// }

module.exports = {
    getPeopleWhoVotedController
}

