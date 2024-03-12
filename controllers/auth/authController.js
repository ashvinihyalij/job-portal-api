import asyncHandler from "express-async-handler";
import {getUser, getUserById, createUser, saveUser} from "../../services/userService.js";
import { getToken, createToken, deleteToken} from "../../services/tokenService.js";
import { validateUserData } from '../../utils/validation/validateUser.js';
import { handleValidationError, handleSuccessResponse } from "../../utils/apiResponse.js";
import logger from '../../utils/winston/index.js';

export const register = asyncHandler(async (req, res, next) => {
    const params = req.body;
    const email = req.body.email;
    const { error } = validateUserData(req.body);

    if (error) {
        handleValidationError(res, error.details[0].message);
    }
    const existingUser = await getUser({email});
    
    if(existingUser){        
        handleValidationError(res, "User is already registered. Please login");
    }
    try {
        const userObject = await createUser(params);

        let token = await createToken(userObject._id);
        const link = `${process.env.BASE_URL}/v1/auth/verify/${userObject._id}/${token.token}`;        
        handleSuccessResponse(
            res,
            "User registered successfully",
            { "_id": userObject.id, "email": userObject.email, "emailVerificationLink": link }
        );
    } catch (error) {
        logger.error(`Error in registerController: ${error}`);
    }
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
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
        user = await saveUser(
            user,
            {
                emailVerified: true,
                active: true
            }
        );
        await deleteToken(userToken._id);
        
        handleSuccessResponse(
            res,
            "Email verified successfully. Your account is active and you can login."
        );
    } catch (error) {
        logger.error(`Error while verify email ${error}`);
    }
});