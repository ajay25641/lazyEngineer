//@ts-check

function success(res, data) {
    res.status(200).json({
        status: "success",
        data: data
    });
}

function error(res, errorCode, data, message = "") {
    res.status(errorCode).json({
        status: "failier",
        message: message,
        data: data
    });
}

module.exports = {
    success,
    error
};