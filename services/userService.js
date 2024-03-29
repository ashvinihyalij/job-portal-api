import userModel from "../models/userModel.js";
import logger from '../utils/winston/index.js';
import { handleErrorResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";

export const updateUser = async (userId, params) => {
    try {
        return await userModel.findByIdAndUpdate(userId, params);
    } catch (error) {
        logger.error(`Error in updateUser: ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
};

export const saveUser = async (user, params) => {
    try {
        // Iterate over the keys of the params object
        Object.keys(params).forEach(key => {
            // Check if the key exists in the user object and update it
            //if (user.hasOwnProperty(key)) {
                user[key] = params[key];
            //}//
        });
        // Save the updated user object
        return await user.save();
    } catch (error) {
        logger.error(`Error in saveUser: ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
};

export const verifyPassword = async (userPassword, hashedPassword) => {
    return await bcrypt.compare(userPassword, hashedPassword);
}
