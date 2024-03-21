import asyncHandler from "express-async-handler";
import { saveUser } from "../../services/userService.js";
import { getToken, createToken, deleteToken } from "../../services/tokenService.js";
import { validateResetPwdData } from "../../utils/validation/validateUser.js";
import { handleValidationError, handleSuccessResponse, handleErrorResponse } from "../../utils/apiResponse.js";
import logger from '../../utils/winston/index.js';
import userModel from "../../models/userModel.js";

/**
 * @route POST v1/auth/login
 * @url http://localhost:8080/api/v1/auth/password-reset
 * @desc Requests for reset password
 * @access Public
 */
export const requestResetPwd = asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    const { error } = validateResetPwdData(req.body);
    if(error) {
        handleValidationError(res, error.details[0].message);
    }

    const user = await userModel.findUser({email});

    if (!user || !user.isActive || !user.emailVerified) {
        return handleErrorResponse(
            res,
            "Please ensure your account is active and your email is verified. Invalid request.",
            401
        );
    }    

    try {
        let token = await getToken({ userId: user._id });

        if (!token) {
            token = await createToken(user._id);
        }
        const link = `${process.env.BASE_URL}/v1/auth/password-reset/${user._id}/${token.token}`;
        return handleSuccessResponse(
            res,
            "password reset link sent to your email account",
            [{ "_id": user.id, "token": token.token, "link": link }]
        );
    } catch (error) {
        logger.error(`Error while requesting password reset ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

/**
 * @route POST v1/auth/login
 * @url http://localhost:8080/api/v1/auth/password-reset/{userId}/{token}
 * @desc Resets password
 * @access Public
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
    try {         
        let user = await userModel.findUserById(req.params.userId);
        if(!user){
            handleValidationError(
                res,
                "invalid link or expired"
            );
        }
        let userToken = await getToken({
            userId: user._id,
            token: req.params.token,
        });

        if(!userToken){
            handleValidationError(
                res,
                "invalid link or expired"
            );
        }        
        user = await saveUser(user, {password: req.body.password});
        await deleteToken(user._id);
        
        return handleSuccessResponse(
            res,
            "Password set successfully"
        );
    } catch (error) {
        logger.error(`Error while password reset ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});