
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
            reason: 'you do not have the required access level, require level 2'
        })
    }
    
}


const superAdminValidate = (req, res, next) => {
    const role = req.user.role

    //aqui se configura el nivel de los roles de los usuario para permitir entrar o no a distintos lugares
    if(role === 3){
        next()
    }else {
        res.status(401).json({
            message: 'Access Denied!',
            reason: 'you do not have the required access level, require level 3'
        })
    }
}
module.exports = adminValidate, superAdminValidate
