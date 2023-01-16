
const adminValidate = (req, res, next) => {
    const role = req.user.role

    //aqui se configura el nivel de los roles de los usuario para permitir entrar o no a distintos lugares
    if(role === 2 || role === 3){
        next()
    }else {
        res.status(401).json({
            message: 'Access Denied!',
            reason: 'you do not have the required access level'
        })
    }
}


module.exports = adminValidate
