const JWTService = require('../CommonLib/JWTtoken');
const tokenModel = require('../Models/token');
const response = require('../response');

async function isValidToken(req, res, next) {
    try {
        const token = req.headers.token;
        if (token) {
            JWTService.verifyToken(token);
            //verification token in db
            const result = await tokenModel.findOne({ token });
            if (result) {
                req.userDataFromToken = result;
                next();
            } else {
                response.error(res,400,"Token is not present in DB","Token is not present in DB");
            }
        } else {
            response.error(res,400,"Token is not present in header","Token is not present in header");
        }
    } catch (error) {
        response.error(res,400,error);
    }
}

module.exports = {
    isValidToken
}