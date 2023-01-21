const { faker } = require('@faker-js/faker');
const uuid = require('uuid')

const Census = require('../../models/census.models')

const randomNumber = (min, max)=>{
    return Math.floor(Math.random()*(max - min)+min);
}


for(let i = 0; i<50; i++){
    Census.create(
        {
            id: uuid.v4(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            citizenID: randomNumber(11300000000, 11300099999),
            age: randomNumber(18, 80),
            gender: faker.name.gender(),
            province: 2,
            municipality: 44,
            district: 211, 
            adress: faker.address.streetAddress(),
            celphone: faker.phone.number('+1829-###-####')
        }
    )
}

/*
Census.bulkCreate([
    {id:1, name:'Azua', parent:0, type: 'Provincia'},
{id:2, name:'Baoruco', parent:0, type: 'Provincia'}
])
*/