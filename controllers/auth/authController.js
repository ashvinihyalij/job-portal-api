import asyncHandler from "express-async-handler";
import {getUser, getUserById, createUser, saveUser} from "../../services/userService.js";
import { getToken, createToken, deleteToken} from "../../services/tokenService.js";
import { validateUserData } from '../../utils/validation/validateUser.js';
import {
            handleValidationError,
            handleSuccessResponse,
            handleErrorResponse 
        } from "../../utils/apiResponse.js";
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
        handleValidationError(res, "It seems you already have an account, please login instead.");
    }
    try {
        const userObject = await createUser(params);        
        let token = await createToken(userObject._id);
        const link = `${process.env.BASE_URL}/v1/auth/verify/${userObject._id}/${token.token}`;        
        handleSuccessResponse(
            res,
            "Thank you for registering with us. Your account has been successfully created.",            
            [{"_id": userObject.id, "email": userObject.email, "emailVerificationLink": link }]
        );
    } catch (error) {
        logger.error(`Error in registerController: ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
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
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

/**
 * @route POST v1/auth/login
 * @desc logs in a user
 * @access Public
 */
export const login = asyncHandler(async (req, res, next) => {
    //console.log('ash');
    //const { email } = req.body;
    //console.log(req.body);
    //try {
        // Check if user exists
        //const user = await getUser({email});
        //console.log(user);
        // return user info except password
        /*const { password, ...user_data } = user._doc;
        if(!user.active){
            handleErrorResponse(
                res,
                "Your account is inactive.",
                401
            );
        }
        if(!user.emailVerified){
            handleValidationError(
                res,
                "Your email is not verified yet.",
                401
            );
        }*/
        /*handleSuccessResponse(
            res,
            "You have successfully logged in.",
            [user_data]
        );*/
    /*} catch (error) {
        logger.error(`Error while login ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }*/
});