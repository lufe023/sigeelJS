const { faker } = require('@faker-js/faker');
const uuid = require('uuid')
const fotos = require('../resultado.json')
const Census = require('../../models/census.models')

const randomNumber = (min, max)=>{
    return Math.floor(Math.random()*(max - min)+min);
}

console.log(fotos)
// for(let i = 0; i<100; i++){
//     Census.create(
//         {
//             id: uuid.v4(),
//             firstName: faker.name.firstName(),
//             lastName: faker.name.lastName(),
//             citizenID: randomNumber(11300399999, 11300334569),
//             age: randomNumber(18, 80),
//             gender: faker.name.gender(),
//             province: 2,
//             municipality: 43,
//             district: 210, 
//             adress: faker.address.streetAddress(),
//             celphone: faker.phone.number('+1829-###-####')
//         }
//     )
// }

/*
Census.bulkCreate([
    {id:1, name:'Azua', parent:0, type: 'Provincia'},
{id:2, name:'Baoruco', parent:0, type: 'Provincia'}
])
*/