const userModel = require("../Models/user");
const JWTService = require("../CommonLib/JWTtoken");
const encryptDecrypt = require("../CommonLib/encryption-decryption");
const tokenModel = require("../Models/token");
const response = require("../response");

async function signIn(req, res, next) {
    //Validate email and password
    const userDetail = await userModel.findOne({ email: req.body.email });
  
    if (userDetail === null) {
      res.send(false);
      return;
    }
    const isValidPassword = encryptDecrypt.decryptPassword(
      req.body.password,
      userDetail.password
    );
    if (isValidPassword) {
      let userData = {
        email: userDetail.email,
        fullName: userDetail.fullName,
        password: userDetail.password
      };
  
      //Generate JWT token and send back to frontend
      let JWTtoken = JWTService.generateToken(userData);
      //Insert token in DB
      await tokenModel.insertMany([{ userId: userDetail._id, token: JWTtoken }]);
  
      response.success(res,{
        token: JWTtoken,
        userDetail: userDetail,
      });
  
    } else {
      res.json({ message: "password is not valid" });
    }
  }
  
  /*
  async function signUp(req, res, next) {
    let userDetail = req.body;
   // const encryptPassword = encryptDecrypt.encryptPassword(userDetail.password);
   // userDetail.password = encryptPassword;
  
    const result = await userModel.insertMany([userDetail]);
  
    //Generate JWT token and send back to frontend
    let JWTtoken = JWTService.generateToken(userDetail);
    //Insert token in DB
    await tokenModel.insertMany([{ userId: result[0]._id, token: JWTtoken }]);
  
    response.success(res,{
      token: JWTtoken,
      userDetail: result[0],
    });
  }
  */
 
 const signUp = async (req,res)=>{
  const {fullName,email,password}=req.body;
  const userDetail = new userModel({
        fullName:fullName,
        email:email,
        password:password,
 });
  userDetail.save().then((response)=>{
    console.log(response);
    const token= JWTService.generateToken();
    console.log(token);
}).catch(err=>{
   res.status(500).json(err);
})
  res.status(200).json(response);
 }



  async function signOut(req, res, next) {
    //remove token from DB
    const token = req.body.token;
    await tokenModel.deleteOne({ token });
    res
      .status(200)
      .json({ status: "Success", message: "Token deleted successfully" });
  }
  
  module.exports = {
    signIn,
    signOut,
    signUp,
  };