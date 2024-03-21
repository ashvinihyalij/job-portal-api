import userModel from "../models/userModel.js";
import logger from '../utils/winston/index.js';
import { handleErrorResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt"
/*export const getUserById = async (userId, password = false) => {
    try {
        if(password)
            return await userModel.findById(userId).select('+password');
        return await userModel.findById(userId);
    } catch (error) {
        logger.error(`Error in getUserById: ${error}`);
    }
};*/

/*export const getUser = async (objectParams, password = false) => {
    try {
        if(password)
            return await userModel.findOne(objectParams).select('+password');
        
        return await userModel.findOne(objectParams);
    } catch (error) {
        logger.error(`Error in getUser: ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
};*/


/*export const createUser = async (params) => {
    try {
        const userObject = createUserObject(params);
        return await userObject.save();
    } catch (error) {
        logger.error(`Error in createUser: ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
};*/

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

/*export const findUserByEmail = async (email, password = false) => {    
    return await userModel.findUser({email}, password);
};*/

export const verifyPassword = async (userPassword, hashedPassword) => {
    return await bcrypt.compare(userPassword, hashedPassword);
}
  
/*const createUserObject = (params) => {
    const user = new userModel({
        name: params.name,
        email: params.email,
        password: params.password,
        active: false,
        emailVerified: false
    });
    return user;
}*/
