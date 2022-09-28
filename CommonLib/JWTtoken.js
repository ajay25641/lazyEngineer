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
exports.generateToken= async ()=>{
  //  console.log(payload);
    const token = await jwt.sign({_id:"6333d8814a84e1d85e8b5470"},SECRET_KEY,{expiresIn:"365 days"});
    //console.log(token);
    return token;
};

exports.validateToken = async (token)=>{
   const userData = await jwt.verify(token,SECRET_KEY);
   return userData;
}

