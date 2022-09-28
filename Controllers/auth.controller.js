const userModel = require("../Models/user");
const JWTService = require("../CommonLib/JWTtoken");
const encryptDecrypt = require("../CommonLib/encryption-decryption");
const tokenModel = require("../Models/token");
const { response } = require("../main.route");
const { JsonWebTokenError } = require("jsonwebtoken");


const signIn = (req, res) => {
  userModel.findOne({ email: req.body.email }, (err, data) => {
    console.log(err);
    if (err) {
      res.send({
        error: err,
        data: null,
      });
    } else {
      if (data === null) {
        res.send({
          message: "Email id does not exist",
          data: null,
        });
      } else {
        const isValidPassword = encryptDecrypt.decryptPassword(
          req.body.password,
          data.password
        );
        if (isValidPassword) {
          const payload = {
            _id: data._id,
          };
          JWTService.generateToken(payload).then((token) => {
            if (token === null)
              res.send({
                message: "Tokenisation failed, please try again",
                data: null,
              });
            else {
              tokenModel
                .deleteOne({ userId: data._id })
                .then(() => {
                  const tokenDetail = new tokenModel({
                    token: token,
                    userId: data._id,
                  });
                  tokenDetail
                    .save()
                    .then((response) => {
                      res.send({
                        message: "User logged in successfully",
                        data: response.token,
                      });
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            }
          }).catch((err)=>console.log(err));
        } else res.send({ message: "password is incorrect", data: null });
      }
    }
  });
};

const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  userModel.findOne({email:req.body.email},(err,data)=>{
    if(err) res.send({message:"Try again",data:null});
    else if(data) res.send({message:"Email id already exist",data:null});
    return;
  });
  const userDetail = new userModel({
    fullName: fullName,
    email: email,
    password: password,
  });
  const encryptPassword = encryptDecrypt.encryptPassword(userDetail.password);
  userDetail.password = encryptPassword;
  userDetail
    .save()
    .then((response) => {
      const payload = {
        _id: response._id,
      };
      JWTService.generateToken(payload)
        .then((token) => {
          const tokenDetail = new tokenModel({
            token: token,
            userId: response._id,
          });
          console.log("Hi");

          tokenDetail.save().then((response) => {
            res.send({
              message: "success",
              data: response.token,
            });
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const signOut = (req,res)=>{
  const {token} = req.body;
  //console.log(req.body);
  console.log(token);
  if(token===null){
     res.send({message:"please provide token"});
     return;
  }
  tokenModel.deleteOne({token:token}).then((response)=>{
    //console.log(response);
    if(response.deletedCount==0) res.send({message:"please register or signIn first"});
    else res.send({message:"User logged out successfully"});
  }).catch((err)=>console.log(err));
}

/*
async function signOut(req, res, next) {
  //remove token from DB
  const token = req.body.token;
  await tokenModel.deleteOne({ token });
  res
    .status(200)
    .json({ status: "Success", message: "Token deleted successfully" });
}
*/

module.exports = {
  signIn,
  signOut,
  signUp,
};
