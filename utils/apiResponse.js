export const handleValidationError = (res, error) => {
    res.status(400);
    throw new Error(error);
};

export const handleSuccessResponse = (res, message, data = null) => {
    res.status(200).send({
        success: true,
        message: message,
        data: data
    });
};