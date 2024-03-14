export const handleValidationError = (res, error) => {
    res.status(400);
    throw new Error(error);
};

export const handleSuccessResponse = (res, message, data = []) => {
    res.status(200).send({
        success: true,
        message: message,
        data: data
    });
};

export const handleErrorResponse = (res, message, code = 500, data = []) => {
    res.status(code).send({
        success: false,
        message: message,
        data: data
    });
};



