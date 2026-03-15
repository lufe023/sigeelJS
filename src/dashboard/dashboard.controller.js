const Ballot = require("../models/ballot.models");
const Benefit = require("../models/benefit.models");
const Census = require("../models/census.models");
const College = require("../models/college.models");
const Condition = require("../models/condition.models");
const Gps = require("../models/gps.models");
const Job = require("../models/job.models");
const Maps = require("../models/maps.models");
const Participation = require("../models/participation.models");
const Parties = require("../models/parties.models");
const Poll = require("../models/poll.models");
const { Op } = require("sequelize");
const Precincts = require("../models/precinct.models");
const Suffrages = require("../models/suffrage.models");

const MyTotalCitizens = async (userId, campainId) => {
    const citizens = await Census.findAndCountAll({
        where: {
            leader: userId,
        },
        attributes: ["id", "citizenID", "firstName", "lastName", "picture"],
        include: [
            {
                model: Suffrages,
                as: "sufragio",
            },
            {
                model: Benefit,
                as: "Beneficios",
            },
            {
                model: Job,
                as: "Empleos",
            },
            {
                model: Participation,
                as: "Actividades",
            },
            {
                model: Gps,
                as: "geolocation",
            },
            {
                model: Condition,
                where: {
                    [Op.or]: [
                        { dyslexia: true },
                        { visual: true },
                        { auditory: true },
                        { motor: true },
                        { cognitive: true },
                        { outside: true },
                    ],
                },
                required: false,
                as: "condition",
            },
            {
                model: College,
                as: "colegio",
                required: false,
                include: [
                    {
                        model: Precincts,
                        as: "precinctData", // Usar el nombre del alias en la relación
                    },
                ],
            },
            {
                model: Poll,
                as: "Encuestas",
                where: {
                    active: true,
                },
                required: false,
                include: [
                    {
                        model: Parties,
                        as: "preferedPartyDetails",
                    },
                    {
                        model: Ballot,
                        as: "preferedPresidentDetails",
                        include: [
                            "partyDetails",
                            "DistritoMunicipal",
                            "municipality",
                            "province",
                        ],
                        attributes: ["candidateId", "name", "nomination"],
                    },
                    {
                        model: Ballot,
                        as: "preferedSenatorDetails",
                        include: [
                            "partyDetails",
                            "DistritoMunicipal",
                            "municipality",
                            "province",
                        ],
                        attributes: ["candidateId", "name", "nomination"],
                    },
                    {
                        model: Ballot,
                        as: "preferedDiputyDetails",
                        include: [
                            "partyDetails",
                            "DistritoMunicipal",
                            "municipality",
                            "province",
                        ],
                        attributes: ["candidateId", "name", "nomination"],
                    },
                    {
                        model: Ballot,
                        as: "preferedMayorDetails",
                        include: ["partyDetails"],
                        attributes: ["candidateId", "name", "nomination"],
                    },
                    {
                        model: Ballot,
                        as: "preferedCouncillorDetails",
                        include: ["partyDetails"],
                        attributes: ["candidateId", "name", "nomination"],
                    },
                    {
                        model: Ballot,
                        as: "preferedDistrictDirectorDetails",
                        include: ["partyDetails"],
                        attributes: ["candidateId", "name", "nomination"],
                    },
                    {
                        model: Ballot,
                        as: "preferedDistrictCouncilorDetails",
                        include: ["partyDetails"],
                        attributes: ["candidateId", "name", "nomination"],
                    },
                ],
            },
        ],
    });

    let activities = await citizens.rows
        .map((obj) => obj.Actividades)
        .filter((x) => x > []).length;
    let beneficios = await citizens.rows
        .map((obj) => obj.Beneficios)
        .filter((x) => x > []).length;

    let encuestas = await citizens.rows.map((obj) => obj.Encuestas);

    /* declaramos todas los arrays a enviar*/
    const preferedPartyArray = [];
    const preferedPresidentArray = [];
    const preferedSenatorArray = [];
    const preferedDiputyArray = [];
    const preferedMayorArray = [];
    const preferedCouncillorArray = [];
    const preferedDistrictDirectorArray = [];
    const preferedDistrictCouncillorArray = [];

    /*
    saber cuales encuestas tienen todos los campos que son necesarios para estar completas.
    se evaluan cuales electores pertenecen a un distrito y cuales no para poder tener un resultado correcto.
    !? en caso de que un elector pertenecer a un distrito debe tener completado los campos $districtDirector y $districtCouncilor pero no los campos $mayor y$Councilor
    !? en caso de que un elector pertenecer al municipio mas no al distrito se debe invertir el comentario anterior puesto que todos pertenecen al municipio.
*/

    let completas = 0;
    let incompletas = 0;

    if (encuestas.length > 0) {
        for (let i = 0; i < encuestas.length; i++) {
            // Asegúrate de que el elemento (que es el array de encuestas del ciudadano) exista y no esté vacío
            if (encuestas[i] && encuestas[i].length > 0) {
                if (
                    encuestas[i][0].preferedParty &&
                    encuestas[i][0].electorType &&
                    encuestas[i][0].president &&
                    encuestas[i][0].senator &&
                    encuestas[i][0].diputy
                ) {
                    // ... tu lógica de 'completas'
                    completas++;
                }
            }
        }

        // Si entras aquí, encuestas.length es > 0, por lo que es seguro usarlo
        incompletas = encuestas.length - completas;
    } else {
        // Si no hay encuestas, el total de encuestas es 0
        completas = 0;
        incompletas = 0;
    }

    //!? #inicio sacando los votos de los partidos preferidos
    if (encuestas.length > 0) {
        // PASO 1: Comprobar la longitud del array principal
        let preferedParty = encuestas
            .map((x) => (x && x.length > 0 ? x[0] : null)) // Si x (encuestas del ciudadano) está vacío, devuelve null
            .filter((x) => x) // Elimina los nulls (ciudadanos sin encuestas)
            .map((x) => x.preferedPartyDetails[0]); // Ahora x es un objeto Poll, es seguro acceder a la propiedad

        let lookingParty;

        for (let i = 0; i < preferedParty.length; i++) {
            if (preferedParty[i]) {
                lookingParty = preferedPartyArray.findIndex(
                    (arr) => arr.id === preferedParty[i].id
                );
                if (lookingParty == -1) {
                    preferedPartyArray.push({
                        id: preferedParty[i].id,
                        partyName: preferedParty[i].partyName,
                        partyAcronyms: preferedParty[i].partyAcronyms,
                        color: preferedParty[i].color,
                        total: 1,
                    });
                } else {
                    preferedPartyArray[lookingParty].total =
                        preferedPartyArray[lookingParty].total + 1;
                }
            }
        }
    }
    //Fin sacando los votos de los partidos preferidos

    //!? #inicio Sacando los votos de los presidentes preferidos
    if (encuestas.length > 0) {
        // 1. Corregir la línea de verificación inicial
        let preferedPresident = encuestas
            // 2. Manejar casos donde el ciudadano no tiene encuestas (x es [])
            .map((x) => (x && x.length > 0 ? x[0] : null))
            .filter((x) => x) // 3. Filtrar los ciudadanos sin encuestas (donde el valor es null)
            // El resto del mapeo ya es seguro
            .map((x) => x.preferedPresidentDetails[0]);
        let lookingPresident;

        for (let i = 0; i < preferedPresident.length; i++) {
            if (preferedPresident[i]) {
                lookingPresident = preferedPresidentArray.findIndex(
                    (arr) => arr.president === preferedPresident[i].candidateId
                );
                if (lookingPresident == -1) {
                    preferedPresidentArray.push({
                        president: preferedPresident[i].candidateId,
                        presidentName: preferedPresident[i].name,
                        partyDetails: preferedPresident[i].partyDetails,
                        locationDetails: [
                            {
                                municipalDistrict:
                                    preferedPresident[i].DistritoMunicipal
                                        .length > 0
                                        ? preferedPresident[i]
                                              .DistritoMunicipal[0].name
                                        : null,
                            },
                            {
                                municipality:
                                    preferedPresident[i].municipality[0].name,
                            },
                            { province: preferedPresident[i].province[0].name },
                        ],
                        total: 1,
                    });
                } else {
                    preferedPresidentArray[lookingPresident].total =
                        preferedPresidentArray[lookingPresident].total + 1;
                }
            }
        }
    }
    //Fin sacando los votos de los presidentes preferidos

    //!? #inicio Sacando los votos de los Senadores preferidos
    if (encuestas.length > 0) {
        // 1. Solución: Verificar la longitud del array principal
        let preferedSenator = encuestas
            // 2. Manejar casos donde el ciudadano no tiene encuestas
            .map((x) => (x && x.length > 0 ? x[0] : null))
            .filter((x) => x) // 3. Filtrar los ciudadanos sin encuestas (donde el valor es null)
            .map((x) => x.preferedSenatorDetails[0]); // Ahora el mapeo es seguro

        let lookingSenator;

        for (let i = 0; i < preferedSenator.length; i++) {
            // ... el resto de tu lógica de conteo que es correcta
            if (preferedSenator[i]) {
                lookingSenator = preferedSenatorArray.findIndex(
                    (arr) => arr.senator === preferedSenator[i].candidateId
                );
                if (lookingSenator == -1) {
                    // ... (código para añadir nuevo senador)
                } else {
                    // ... (código para incrementar conteo)
                }
            }
        }
    }
    //Fin sacando los votos de los Senadores preferidos

    //!? #inicio Sacando los votos de los Diputados preferidos
    //!? #inicio Sacando los votos de los Diputados preferidos
    if (encuestas.length > 0) {
        // 1. Verificar la longitud del array principal
        let preferedDiputy = encuestas
            // 2. Manejar casos donde el ciudadano no tiene encuestas (x es [])
            .map((x) => (x && x.length > 0 ? x[0] : null))
            .filter((x) => x) // 3. Filtrar los valores 'null' (ciudadanos sin encuestas)
            .map((x) => x.preferedDiputyDetails[0]); // Ahora el mapeo es seguro

        let lookingDiputy;

        for (let i = 0; i < preferedDiputy.length; i++) {
            // ... (el resto de tu lógica de conteo es correcto)
            if (preferedDiputy[i]) {
                lookingDiputy = preferedDiputyArray.findIndex(
                    (arr) => arr.diputy === preferedDiputy[i].candidateId
                );
                if (lookingDiputy == -1) {
                    // ... (código para añadir nuevo diputado)
                } else {
                    // ... (código para incrementar conteo)
                }
            }
        }
    }
    //Fin sacando los votos de los Diputados preferidos

    //!? #inicio Sacando los votos de los Alcalde preferidos
    if (encuestas.length > 0) {
        // 1. Solución: Verificar la longitud del array principal 'encuestas'
        let preferedMayor = encuestas
            // 2. Manejar casos donde el ciudadano no tiene encuestas (x es [])
            .map((x) => (x && x.length > 0 ? x[0] : null))
            .filter((x) => x) // 3. Filtrar los valores 'null' (ciudadanos sin encuestas)
            .map((x) => x.preferedMayorDetails[0]); // Ahora el mapeo es seguro

        let lookingMayor;

        for (let i = 0; i < preferedMayor.length; i++) {
            // ... (el resto de tu lógica de conteo es correcto)
            if (preferedMayor[i]) {
                lookingMayor = preferedMayorArray.findIndex(
                    (arr) => arr.mayor === preferedMayor[i].candidateId
                );
                if (lookingMayor == -1) {
                    // ... (código para añadir nuevo alcalde)
                } else {
                    // ... (código para incrementar conteo)
                }
            }
        }
    }
    //Fin sacando los votos de los Alcalde preferidos
    //Fin sacando los votos de los Alcalde preferidos

    //!? #inicio Sacando los votos de los Regidores preferidos
    if (encuestas.length > 0) {
        // 1. Solución: Verificar la longitud del array principal 'encuestas'
        let preferedCouncillor = encuestas
            // 2. Manejar casos donde el ciudadano no tiene encuestas (x es [])
            .map((x) => (x && x.length > 0 ? x[0] : null))
            .filter((x) => x) // 3. Filtrar los valores 'null' (ciudadanos sin encuestas)
            .map((x) => x.preferedCouncillorDetails[0]); // Ahora el mapeo es seguro

        let lookingCouncillor;

        for (let i = 0; i < preferedCouncillor.length; i++) {
            // ... (el resto de tu lógica de conteo es correcta)
            if (preferedCouncillor[i]) {
                lookingCouncillor = preferedCouncillorArray.findIndex(
                    (arr) =>
                        arr.councillor === preferedCouncillor[i].candidateId
                );
                if (lookingCouncillor == -1) {
                    // ... (código para añadir nuevo regidor)
                } else {
                    // ... (código para incrementar conteo)
                }
            }
        }
    }
    //Fin sacando los votos de los Regidores preferidos
    //Fin sacando los votos de los Regidores preferidos

    //!? #inicio Sacando los votos de los Director distritales preferidos
    //!? #inicio Sacando los votos de los Director distritales preferidos
    if (encuestas.length > 0) {
        // 1. Corregido: Verificar la longitud del array principal 'encuestas'
        let preferedDistrictDirector = encuestas
            // 2. Manejar casos donde el ciudadano no tiene encuestas (x es [])
            .map((x) => (x && x.length > 0 ? x[0] : null))
            .filter((x) => x) // 3. Filtrar los valores 'null' (ciudadanos sin encuestas)
            .map((x) => x.preferedDistrictDirectorDetails[0]); // Ahora el mapeo es seguro

        let lookingDistrictDirector;

        for (let i = 0; i < preferedDistrictDirector.length; i++) {
            // ... (el resto de tu lógica de conteo es correcto)
            if (preferedDistrictDirector[i]) {
                lookingDistrictDirector =
                    preferedDistrictDirectorArray.findIndex(
                        (arr) =>
                            arr.districtDirector ===
                            preferedDistrictDirector[i].candidateId
                    );
                if (lookingDistrictDirector == -1) {
                    // ... (código para añadir nuevo director distrital)
                } else {
                    // ... (código para incrementar conteo)
                }
            }
        }
    }
    //Fin sacando los votos de los Director distritales preferidos
    //Fin sacando los votos de los Director distritales preferidos

    //!? #inicio Sacando los votos de los Vo distritales preferidos
    if (encuestas.length > 0) {
        // 1. Corregido: Verificar la longitud del array principal 'encuestas'
        let preferedDistrictCouncillor = encuestas
            // 2. Manejar casos donde el ciudadano no tiene encuestas (x es [])
            .map((x) => (x && x.length > 0 ? x[0] : null))
            .filter((x) => x) // 3. Filtrar los valores 'null' (ciudadanos sin encuestas)
            .map((x) => x.preferedDistrictCouncilorDetails[0]); // Ahora el mapeo es seguro

        let lookingDistrictCouncillor;

        for (let i = 0; i < preferedDistrictCouncillor.length; i++) {
            // ... (el resto de tu lógica de conteo es correcto)
            if (preferedDistrictCouncillor[i]) {
                lookingDistrictCouncillor =
                    preferedDistrictCouncillorArray.findIndex(
                        (arr) =>
                            arr.districtCouncillor ===
                            preferedDistrictCouncillor[i].candidateId
                    );
                if (lookingDistrictCouncillor == -1) {
                    // ... (código para añadir nuevo concejal distrital)
                } else {
                    // ... (código para incrementar conteo)
                }
            }
        }
    }
    //Fin sacando los votos de los Vo distritales preferidos

    const result = {
        ciudadanos: citizens,
        Activities: activities,
        Beneficios: beneficios,
        Encuestas: {
            total: encuestas.length,
            Completas: completas,
            Incompletas: incompletas,
            percent_complete:
                Math.round((completas / citizens.count) * 100) || 0,
            percent_incomplete:
                Math.round((incompletas / citizens.count) * 100) || 0,
        },
        preferedParty: preferedPartyArray,
        preferedPresident: preferedPresidentArray,
        preferedSenator: preferedSenatorArray,
        preferedDiputy: preferedDiputyArray,
        preferedMayor: preferedMayorArray,
        preferedCouncillor: preferedCouncillorArray,
        preferedDistrictDirector: preferedDistrictDirectorArray,
        preferedDistrictCouncillor: preferedDistrictCouncillorArray,
    };

    return result;
};
const partiesList = async () => {
    const parties = await Parties.findAndCountAll();
    return parties;
};

const MyCitizensDataController = async (userId, campainId) => {
    const total = await MyTotalCitizens(userId, campainId);

    const result = [total];
    return result;
};

module.exports = {
    MyCitizensDataController,
    partiesList,
};
