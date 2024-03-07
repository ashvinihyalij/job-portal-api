import userModel from "../models/userModel.js";

export const getUserById = async (userId) => {
    try {
        return await userModel.findById(userId);
    } catch (error) {
        console.error("Error in getUser:", error);
    }
};

export const getUser = async (objectParams) => {
    try {
        return await userModel.findOne(objectParams);
    } catch (error) {
        console.error("Error in getUser:", error);
    }
};

export const createUser = async (params) => {
    try {
        const userObject = createUserObject(params);
        return await userObject.save();
    } catch (error) {
        console.error("Error in createUser:", error);
    }
};

export const updateUser = async (userId, params) => {
    try {
        return await userModel.findByIdAndUpdate(userId, params);
    } catch (error) {
        console.error("Error in createUser:", error);
    }
};

export const saveUser = async (user, params) => {
    try {        
        // Iterate over the keys of the params object
        Object.keys(params).forEach(key => {
            console.log(key);
            // Check if the key exists in the user object and update it
            //if (user.hasOwnProperty(key)) {                
                user[key] = params[key];                
            //}//
        });        
        // Save the updated user object
        return await user.save();        
    } catch (error) {
        console.error("Error in createUser:", error);
    }
};

const createUserObject = (params) => {
    const user = new userModel({
        name: params.name,
        email: params.email,
        password: params.hashedPassword,
        active: true
    });
    return user;
}
