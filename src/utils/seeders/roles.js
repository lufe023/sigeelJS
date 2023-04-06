const Roles = require('../../models/roles.models')

Roles.bulkCreate([
    {id:1, roleName: 'Colaborador', level: 1},
    {id:2, roleName: 'Administrador', level: 2},
    {id:3, roleName: 'Super Admin', level: 3}
])
