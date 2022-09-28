const jwt = require('jsonwebtoken');

const SECRET_KEY="161d57caf9c9146303477f6f1c11cd2b41ad4814ec799a3ac17c8a9cd228d732";

/*
function generateToken(payload) {

    let token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2 days" });
    return token;
}

function verifyToken(token) {
    let data = jwt.verify(token, SECRET_KEY);
    return data;
}

module.exports = {
    generateToken,
    verifyToken
}

*/
exports.generateToken= (payload) => {
    console.log(payload);
    jwt.sign(payload,SECRET_KEY,{expiresIn:"365 days"}).then((token)=>{
        return token;
    }).catch((err)=>console.log(err));
    
};

exports.validateToken = async (token)=>{
   const userData = await jwt.verify(token,SECRET_KEY);
   return userData;
}

