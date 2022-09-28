const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

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
exports.generateToken= async (payload)=>{
    console.log(payload);
    const token = await jwt.sign(payload,SECRET_KEY,{expiresIn:"365 days"});
    return token;
};

exports.validateToken = async (token)=>{
   const userData = await jwt.verify(token,SECRET_KEY);
   return userData;
}

