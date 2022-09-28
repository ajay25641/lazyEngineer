const userModel = require("../Models/user");
const JWTService = require("../CommonLib/JWTtoken");
const encryptDecrypt = require("../CommonLib/encryption-decryption");
const tokenModel = require("../Models/token");
const response = require("../response");

/*
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
      password: userDetail.password,
    };

    //Generate JWT token and send back to frontend
    let JWTtoken = JWTService.generateToken(userData);
    //Insert token in DB
    await tokenModel.insertMany([{ userId: userDetail._id, token: JWTtoken }]);

    response.success(res, {
      token: JWTtoken,
      userDetail: userDetail,
    });
  } else {
    res.json({ message: "password is invalid" });
  }
}
*/
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
            _id: response._id,
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
                        data: response,
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
              response: response,
            });
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

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
