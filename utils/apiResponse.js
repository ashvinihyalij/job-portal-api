export const handleValidationError = (res, error) => {
    res.status(400);
    throw new Error(error);
};

export const handleSuccessResponse = (res, message, data = [], pagination = {}) => {
    const hasPagination = Object.keys(pagination).length > 0;
    const responseObject = {
        success: true,
        message: message,
        data: data
    };
    if (hasPagination) {
        responseObject.pagination = pagination;
    }
    res.status(200).send(responseObject);
};

export const handleErrorResponse = (res, message, code = 500, data = []) => {
    res.status(code).send({
        success: false,
        message: message,
        data: data
    });
};



