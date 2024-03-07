import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
//import userModel from "../models/userModel.js";
import {getUser, createUser} from "../services/authService.js";

export const registerController = asyncHandler(async (req, res, next) => {
    const params = req.body;
    const {name, email, password} = req.body;
    //validate
    if(!name){
        res.status(400);
        throw new Error("Please provide name");
    }
    if(!email){        
        res.status(400);
        throw new Error("Please provide email");
    }
    if(!password){
        res.status(400);
        throw new Error("Please provide password");
    }
    const existingUser = await getUser({email});
    if(existingUser){        
        res.status(400);        
        throw new Error("User is already registered. Please login");
    }
    try {
        // Hash password
        const hashedPassword = await createHash(password);
        params.hashedPassword = hashedPassword;
           
        const userObject = await createUser(params);
        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user: { "_id": userObject.id, "email": userObject.email }
        });
    } catch (error) {
        // Check if the error is a validation error
        if (error.name === 'ValidationError') {
            // Extract error messages from validation errors
            const errorMessages = Object.values(error.errors).map(error => error.message);
            res.status(400);
            throw new Error(errorMessages.join('. '));
        } else {
            // For other types of errors, pass them to the global error handler
            next(error);
        }
    }
});

const createHash = async (password)  => {
    return await bcrypt.hash(password, 10);
}