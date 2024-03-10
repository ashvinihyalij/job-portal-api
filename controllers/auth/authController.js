import asyncHandler from "express-async-handler";
import {getUser, createUser} from "../../services/userService.js";
import { validateUserData } from '../../utils/validation/validateUser.js';
import logger from '../../utils/winston/index.js';

export const registerController = asyncHandler(async (req, res, next) => {
    const params = req.body;
    const email = req.body.email;
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
        const userObject = await createUser(params);
        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user: { "_id": userObject.id, "email": userObject.email }
        });
    } catch (error) {
        logger.error(`Error in registerController: ${error}`);
    }
});