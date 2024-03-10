import asyncHandler from "express-async-handler";
import { getUser, getUserById, saveUser } from "../../services/userService.js";
import { getToken, createToken} from "../../services/tokenService.js";
import { validateResetPwdData } from "../../utils/validation/validateUser.js";
import { handleValidationError, handleSuccessResponse } from "../../utils/apiResponse.js";
import logger from '../../utils/winston/index.js';

export const requestResetPwd = asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    const { error } = validateResetPwdData(req.body);
    if(error) {
        handleValidationError(res, error.details[0].message);
    }

    const user = await getUser({email});
    if(!user){
        handleValidationError(
            res,
            "User doesn't exist.Please provide correct email."
        );
    }

    try {
        let token = await getToken({ userId: user._id });

        if (!token) {
            token = await createToken(user._id);
        }
        const link = `${process.env.BASE_URL}/v1/password-reset/${user._id}/${token.token}`;
        handleSuccessResponse(
            res,
            "password reset link sent to your email account",
            { "_id": user.id, "token": token.token, "link": link }
        );
    } catch (error) {
        logger.error(`Error while requesting password reset ${error}`);
    }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    try {
        let user = await getUserById(req.params.userId); 

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
        //await userToken.remove();
        /*user.password = req.body.password;
        await user.save();
        await userToken.delete();*/
        
        handleSuccessResponse(
            res,
            "Password set successfully"
        );
    } catch (error) {
        logger.error(`Error while password reset ${error}`);
    }
});