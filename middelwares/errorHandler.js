import  constants from "../constants.js";
const errorHandler = (err, req, res, next) => {
    //console.log(res);
    const statusCode = res.statusCode ? res.statusCode : 500;
    
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({
                success: false,
                title: "Validation failed",
                message: err.message,
                stackStrace: err.stack
            });
            break;
        case constants.NOT_FOUND:
            res.json({
                success: false,
                title: "Not found",
                message: err.message,
                stackStrace: err.stack
            });
            break;
        case constants.UNAUTHORIZED:
            res.json({
                success: false,
                title: "Unauthorized",
                message: err.message,
                stackStrace: err.stack
            });
            break;
        case constants.FORBIDDEN:
            res.json({
                success: false,
                title: "Forbidden",
                message: err.message,
                stackStrace: err.stack
            });
            break;
        case constants.SERVER_ERROR:
            res.json({
                success: false,
                title: "Server error",
                message: err.message,
                stackStrace: err.stack
            });
            break;
        default:
            console.log('No error. All good');
            break;
    }
    
};

export default errorHandler;