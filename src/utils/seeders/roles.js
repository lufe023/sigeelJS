const Roles = require('../../models/roles.models')

Roles.bulkCreate([
    {id:1, roleName: 'colaborador', level: 1},
    {id:2, roleName: 'administrador', level: 2},
    {id:3, roleName: 'Super Admin', level: 3}
])
