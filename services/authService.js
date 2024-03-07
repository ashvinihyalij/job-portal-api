import userModel from "../models/userModel.js";

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
const createUserObject = (params) => {    
    const user = new userModel({
        name: params.name,
        email: params.email,
        password: params.hashedPassword,
        active: true
    });    
    return user;
}
