const userModel = require("../Models/user");
const JWTService = require("../CommonLib/JWTtoken");
const encryptDecrypt = require("../CommonLib/encryption-decryption");
const tokenModel = require("../Models/token");

exports.signIn = (req, res) => {
  userModel.findOne({ email: req.body.email }, (err, data) => {
    console.log(err);
    if (err) {
      res.send({
        status: "400",
        error: err,
        data: null,
      });
    } else {
      if (data === null) {
        res.send({
          status: "400",
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
          JWTService.generateToken(payload)
            .then((token) => {
              if (token === null)
                res.send({
                  status: "400",
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
                          status: "200",
                          message: "User logged in successfully",
                          data: {
                            fullName: data.fullName,
                            email: data.email,
                            univercity: data.univercity,
                            token: response.token,
                          },
                        });
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              }
            })
            .catch((err) => console.log(err));
        } else
          res.send({
            status: "400",
            message: "password is incorrect",
            data: null,
          });
      }
    }
  });
};

exports.signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  userModel.findOne({ email: req.body.email }, (err, data) => {
    if (err) res.send({ status: "400", message: "Try again", data: null });
    else if (data)
      res.send({
        status: "400",
        message: "Email id already exist",
        data: null,
      });
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
    .then((data) => {
      const payload = {
        _id: data._id,
      };
      JWTService.generateToken(payload)
        .then((token) => {
          const tokenDetail = new tokenModel({
            token: token,
            userId: data._id,
          });
          console.log("Hi");

          tokenDetail.save().then((response) => {
            //console.log(response);
            res.send({
              status: "200",
              message: "user registered successfully",
              data: {
                fullName: data.fullName,
                email: data.email,
                univercity: data.univercity,
                token: response.token,
              },
            });
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.signOut = (req, res) => {
  const { token } = req.body;
   
  console.log(token);
  if (token === null || token === undefined) {
    res.send({ status: "400", message: "please provide token" });
    return;
  }
  tokenModel
    .deleteOne({ token: token })
    .then((response) => {
      //console.log(response);
      if (response.deletedCount == 0)
        res.send({ status: "400", message: "please register or signIn first" });
      else res.send({ status: "200", message: "User logged out successfully" });
    })
    .catch((err) => console.log(err));
};
