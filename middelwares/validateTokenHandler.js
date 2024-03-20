import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";
import { handleErrorResponse } from "../utils/apiResponse.js";
export const verify = asyncHandler(async(req, res, next) => {
    try {
        let token;        
        let authHeader = req.headers.Authorization || req.headers.authorization;
        
        // if there is no cookie from request header, send an unauthorized response.
        if (!authHeader)
            return handleErrorResponse(
                res,
                "Unauthorized access",
                401
            );
        if(authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            
            jwt.verify(token, SECRET_ACCESS_TOKEN, async(err, decoded) => {
                
                if (err) {
                    // if token has been altered or has expired, return an unauthorized error
                    return handleErrorResponse(
                        res,
                        "This session has expired. Please login",
                        401
                    );
                }
                const { id } = decoded; // get user id from the decoded token                
                req.user = await userModel.findUserById(id);
                next();
            });
        }        
    } catch (err) {
        logger.error(`Error in registerController: ${err}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});
