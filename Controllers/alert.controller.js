const alertModel = require('../Models/alert');
const response = require('../response');
const notification = require('../Notification/notification');

exports.getAllAlerts= async (req,res,next)=>{
    try {
        const skip = req.query.skip || 0;
        const limit = req.query.limit || 10;
        let result = await alertModel.find({}).skip(skip).limit(limit);
        let totalCount = await alertModel.count();
        response.success(res, { result, totalCount,skip,limit });
    } catch (error) {
        response.error(res, 500, error);
    }
};

exports.createAlert = async (req,res,next)=>{
    try {

        let alertDetail = req.body;
        alertDetail.userId = req.userDataFromToken._id
        console.log(alertDetail);
        console.log(req.userDataFromToken);
        let result = await alertModel.insertMany([alertDetail]);

        notification.sendNotification(alertDetail.tags, alertDetail.heading, alertDetail.message);
        response.success(res, result[0]);

    } catch (error) {
        response.error(res, 400, error, "Unable to all alert");
    }
};