
const adminValidate = (req, res, next) => {
    const role = req.user.role

    //aqui se configura el nivel de los roles de los usuario para permitir entrar o no a distintos lugares
    //role = 1 es colaborador
    // role = 2 es admin
    //role = 3 es super admin
    if(role >= 2){
        next()
    }else {
        res.status(401).json({
            message: 'Access Denied!',
            reason: 'you do not have the required access level: Admin',
            requiredLevel: 2,
            your: role
        })
    }
    
}

const leaderValidate = (req, res, next) => {
    const role = req.user.role

    //aqui se configura el nivel de los roles de los usuario para permitir entrar o no a distintos lugares
    //role = 1 es colaborador
    // role = 2 es admin
    //role = 3 es super admin
    if(role >= 3){
        next()
    }else {
        res.status(401).json({
            message: 'Access Denied!',
            reason: 'you do not have the required access level: Leader',
            requiredLevel: 3,
            your: role
        })
    }
    
}

const itSupportValidate = (req, res, next) => {
    const role = req.user.role

    //aqui se configura el nivel de los roles de los usuario para permitir entrar o no a distintos lugares
    if(role >= 4){
        next()
    }else {
        res.status(401).json({
            message: 'Access Denied!',
            reason: 'you do not have the required access level: IT Support',
            requiredLevel: 4
        })
    }
}

const superAdminValidate = (req, res, next) => {
    const role = req.user.role

    //aqui se configura el nivel de los roles de los usuario para permitir entrar o no a distintos lugares
    if(role === 5){
        next()
    }else {
        res.status(401).json({
            message: 'Access Denied!',
            reason: 'You need to be GodLevel',
            requiredLevel: 9999999999
        })
    }
}


module.exports = {
    leaderValidate, adminValidate, itSupportValidate, superAdminValidate}
