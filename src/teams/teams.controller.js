const Teams = require("../models/teams.models")
const uuid = require('uuid')
const Users = require('../models/users.models')
const { Op } = require('sequelize');
const Census = require("../models/census.models");
const Roles = require("../models/roles.models");
const teamsMembers = require("../models/teamsMembers.models");
const Todo = require("../models/todo.models");

//llamar todos los equipos
const getAllTeams = async (role) => {
const allTeams = await Teams.findAll({
    include:[
        {
            model: teamsMembers,
            as: 'members',
            include:[
                {
                model:Users,
                as: "memberData",
                attributes:['email'],
                include:[
                    {
                        model: Roles
                    },
                    {
                        model:Census,
                        attributes:{  
                            exclude: role <= 1 ? ['celphone','adress','telephone', 'otherPhone'] : []
                        }
                    }
                ]
            }
            ]
        }
    ]
})

return allTeams
} 

const getOneTeamController = async(id) => {

    const getTeam = await Teams.findOne({
        where: {
            id
        },
        include:[
            {
                model:Users,
                as: 'woner',
                attributes:['email'],
                    include:[
                        {
                            model: Roles
                        },
                        {
                            model:Census,
                        }
                    ]
            },
            {
                model: teamsMembers,
                as: 'members',
                include:[
                    {
                    model:Users,
                    as: "memberData",
                    attributes:['email'],
                    include:[
                        {
                            model: Roles
                        },
                        {
                            model:Census,
                        },
                        {
                            model: Todo,
                            as: 'tasks'
                        }
                    ]
                }
                ]
            }
        ]
    })

    return getTeam

}

//create new candidate
const createNewTeam = async (data, createdBy) => {

    const newTeam = await Teams.create({
        id: uuid.v4(),
        name: data.name,
        createdBy,
        logo: data.logo,
        description: data.description,
        whatsapp: data.whatsapp
    })

    return newTeam
}

const updateTeamController = async (data, teamId) => {
    const result = await Teams.update(data, {
        where: {
            id: teamId // Asegúrate de que teamId sea de tipo UUID
        }
    });

    return [result];
}


//agregar 1 o varios registros a la vez un equipo //teamId, members, teamLeder:uuid leader or null or false
const addMembersTeam = async (teamId, members, teamLeader) => {

    //llamando los miembros del modelo teamMember para luego filtrarlos y compararlos para evitar duplicados
    const existingMembers = await teamsMembers.findAll({
        where: {
        memberId: {
            [Op.in]: members // array de miembros que deseas insertar
        },
        teamId
        }
    });
    //filtrando los miembros que ya existen en el modelo
    const newMembers = members.filter(member => {
        return !existingMembers.some(existingMember => existingMember.memberId === member);
    });


    //members need to be an object array like this
    // [{teamId: teamId, memberId: '', teamLeader:false}]

    const handleMembers = newMembers.map(member => {
        return {
            id: uuid.v4(),
            teamId: teamId,
            memberId: member,
            teamLeader: teamLeader==member?true:false
        };
    });

    const adding = await teamsMembers.bulkCreate(handleMembers)

    return adding

}

//obtener los equipos a los que un usuario pertenece enviando el id del usuario
    const getTeamsByUserController = async (memberId, role) => {

        const teams = await teamsMembers.findAll({
            where: {
                memberId: memberId
            },
            include:[
                {
                    model:Teams,
                    as: 'team',
                    include:[
                        {
                            model:Users,
                            as: 'woner',
                            attributes:['email'],
                                include:[
                                    {
                                        model: Roles
                                    },
                                    {
                                        model:Census,
                                    }
                                ]
                        },
                        {
                            model: teamsMembers,
                            as: 'members',
                            include:[
                                {
                                model:Users,
                                as: "memberData",
                                attributes:['email'],
                                include:[
                                    {
                                        model: Roles
                                    },
                                    {
                                        model:Census,
                                    }
                                ]
                            }
                            ]
                        }
                    ]
                },
            ]
        });
        return teams;
};

const deleteTeamMemberController = async (teamId, memberId) => {
    const deletedMember = await teamsMembers.destroy({
        where: {
            memberId,
            teamId
        }
    });

    return deletedMember
}

const deleteTeamController = async (id) => {
    const deleteTeam = await Teams.destroy({
        where:{
            id
        }
    })

    return deleteTeam

}

module.exports = {
    getAllTeams,
    createNewTeam,
    getTeamsByUserController,
    getOneTeamController,
    addMembersTeam,
    deleteTeamMemberController,
    deleteTeamController,
    updateTeamController
}