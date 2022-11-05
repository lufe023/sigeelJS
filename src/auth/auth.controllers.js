const { getUserbyEmail } = require("../users/users.controllers")





const loginUser = (email, password) => {
    getUserbyEmail(email)
    .then(response=>{
        console.log(response)
    })
    .catch(err=>{
        console.log(err)
    })
}

