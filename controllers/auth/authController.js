import asyncHandler from "express-async-handler";
import { saveUser, verifyPassword} from "../../services/userService.js";
import { getToken, createToken, deleteToken} from "../../services/tokenService.js";
import { validateUserData, validateLoginData } from '../../utils/validation/validateUser.js';
import logger from '../../utils/winston/index.js';
import userModel from "../../models/userModel.js";
import { BASE_URL } from "../../config/index.js";
import { makeObjectSelected } from '../../utils/common.js';
import {
            handleValidationError,
            handleSuccessResponse,
            handleErrorResponse
        } from "../../utils/apiResponse.js";

/**
 * @route POST v1/auth/register
 * @url http://localhost:8080/api/v1/auth/register
 * @desc registers a user
 * @access Public
 */
export const register = asyncHandler(async (req, res, next) => {
    const params = req.body;    
    const { error } = validateUserData(params);
    if (error) {
        handleValidationError(res, error.details[0].message);
    }

    const existingUser = await userModel.findUser({email:req.body.email});
    if(existingUser){
        handleValidationError(res, "It seems you already have an account, please login instead.");
    }

    try {
        const userObject = await userModel.createUser(params);        
        let token = await createToken(userObject._id);
        const link = `${BASE_URL}/v1/auth/verify/${userObject._id}/${token.token}`;
        let userData = makeObjectSelected(userObject, ['_id', 'firstName', 'lastName', 'email', 'role', 'isActive']);
        userData.link = link;

        handleSuccessResponse(
            res,
            "Thank you for registering with us. Your account has been successfully created.",            
            [userData]
        );
    } catch (error) {
        logger.error(`Error in registerController: ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

/**
 * @route GET v1/auth/verify/{token}
 * @url http://localhost:8080/api/v1/auth/verify/{token}
 * @desc verifies email
 * @access Public
 */
export const verifyEmail = asyncHandler(async (req, res, next) => {
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
        user = await saveUser(
            user,
            {
                emailVerified: true,
                isActive: true
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
 * @url http://localhost:8080/api/v1/auth/login
 * @desc logs in a user
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
    try {
        const { error } = validateLoginData(req.body);

        if (error) {
            return handleErrorResponse(
                res,
                "Invalid credentials",
                400
            );
        }
        const { email, password: userPassword } = req.body;
        const user = await userModel.findUser({email}, true);
    
        if (!user || !user.isActive || !user.emailVerified) {
            return handleErrorResponse(
                res,
                "Please ensure your account is active and your email is verified. Invalid credentials.",
                401
            );
        }
        const isPasswordValid = await verifyPassword(userPassword, user.password);
        if (!isPasswordValid) {
            return handleErrorResponse(
                res,
                "Invalid email or password. Please try again.",
                401
            );
        }

        const { password, ...user_data } = user._doc;
        
        const token = user.generateAccessJWT(); // generate session token for user        
        user_data.token = token;
        handleSuccessResponse(
            res,
            "You have successfully logged in.",
            [user_data]
        );
    } catch (error) {
        logger.error(`Error while login ${error}`);
        handleErrorResponse(res, "Internal Server Error");
    }
});