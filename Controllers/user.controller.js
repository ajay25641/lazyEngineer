const userModel = require('../Models/user');
const parentModel = require('../Models/parents');
const { default: mongoose } = require('mongoose');
const emailService = require('../Notification/EmailService');
const insuranceModel = require('../Models/Insurance');
const constantObj = require('../CommonLib/constant');

async function getAllUser(req, res, next) {

    try {
        const skip = req.query.skip || 0;
        const limit = req.query.limit || 10;
        let response = await userModel.find({}).skip(skip).limit(limit);
        let totalCount = await userModel.count();
        res.json({
            status: constantObj.status.SUCCESS,
            message: constantObj.success.DATA_FETCH,
            response,
            totalCount
        });

    } catch (error) {
        res.status(500).json(error);
    }
}

async function createUser(req, res, next) {
    //fetch info from request body
    try {

        let userDetail = req.body;
        let response = await userModel.insertMany([userDetail]);

        req.body.parents.forEach(ele => {
            ele.empId = response[0]._id;
        });

        let result = await parentModel.insertMany(req.body.parents);
        await userModel.updateOne({ _id: response[0]._id }, { $push: { parentsId: [result[0]._id, result[1]._id] } })
        res.json(response);

    } catch (error) {
        res.json(error);
    }
}

async function getUserById(req, res, next) {
    let userId = req.params.userId;
    let response = await userModel.find({ _id: userId });
    res.json(response);
}

async function deleteUser(req, res, next) {
    let userId = req.params.userId;
    let response = await userModel.deleteOne({ _id: userId });
    res.json(response);
}

async function updateUser(req, res, next) {
    let userId = req.params.userId;
    let body = req.body;
    let response = await userModel.updateOne({ _id: userId }, { $set: body });
    res.json(response);
}

async function getParentsInfo(req, res, next) {
    console.log(req.params);
    let response = await parentModel.find({ empId: mongoose.Types.ObjectId(req.params.empId) }).populate('empId');
    res.json(response);
}
async function sendEmail(req, res, next) {
    console.log("in SendEmail function");

    const message = req.body.message;
    let response = await emailService.sendMail({

        from: '"Neeraj Gupta" <neeraj@unthinkable.co>', // sender address
        to: "neeraj.cbpgec@gmail.com", // list of receivers
        subject: "Hello World from Masai", // Subject line
        text: "Hello world", // plain text body
        html: `<b>${message}</b>`, // html body
    });

    console.log(response);
    res.send(true);
}

function saveImage(req, res, next) {
    console.log("Request file", req.file)
    res.json({
        "message": "Image saved",
        path: req.file.path
    })
}


async function dashboard(req, res, next) {
    res.send('We are on dashboard');
}

async function createInsurance(req, res, next) {
    let obj = {
        insuranceName: req.body.insuranceName,
        empId: mongoose.Types.ObjectId(req.body.empId)
    }
    const response = await insuranceModel.insertMany([obj]);
    res.status(200).json(response);
}

async function getAllInsurance(req, res, next) {

    const response = await insuranceModel.find({}).populate('empId');
    res.status(200).json(response);
}

module.exports = {
    getAllUser,
    createUser,
    getUserById,
    deleteUser,
    updateUser,
    getParentsInfo,
    sendEmail,
    saveImage,
    dashboard,
    createInsurance,
    getAllInsurance,
}