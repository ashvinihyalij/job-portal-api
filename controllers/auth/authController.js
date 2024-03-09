import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import {getUser, createUser} from "../../services/userService.js";
import { validateUserData } from '../../utils/validation/validateUser.js';

export const registerController = asyncHandler(async (req, res, next) => {
    const params = req.body;
    const {email, password} = req.body;
    const { error } = validateUserData(req.body);

    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
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