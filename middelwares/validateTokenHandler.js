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
                const user = await userModel.findUserById(id);
                if (!user.isActive) {
                    // if user is inactive in status, return an unauthorized error
                    return handleErrorResponse(
                        res,
                        "User is not active. Please contact website administrator",
                        401
                    );
                }
                req.user = user;             
                next();
            });
        }        
    } catch (err) {
        logger.error(`Error in verify: ${err}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

/*export const verifyRole = asyncHandler(async(req, res, next) => {
    try {
        const user = req.user; // we have access to the user object from the request
        const { role } = user; // extract the user role
        // check if user has no advance privileges
        // return an unathorized response
        if (role !== "msp") {
            return handleErrorResponse(
                res,
                "You are not authorized to view this page.",
                401
            );
        }
        next(); // continue to the next middleware or function
    } catch (err) {
        logger.error(`Error in verifyrole: ${err}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});*/

export const verifyAdmin = asyncHandler(async(req, res, next) => {
    try {
        const user = req.user; // we have access to the user object from the request        
        const { role, roleStatus } = user; // extract the user role
        // check if user has no advance privileges
        // return an unathorized response
        if (role !== "admin") {            
            return handleErrorResponse(
                res,
                "Sorry, You'he no rights to perform this operation.",
                401
            );
        }
        next(); // continue to the next middleware or function
    } catch (err) {
        logger.error(`Error in verifyAdmin: ${err}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const verifyRole = (allowedRoles) => asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const { role } = user;

        // Check if the user role is allowed
        if (!allowedRoles.includes(role)) {
            return handleErrorResponse(
                res,
                "Forbidden - You don't have permission to access this.",
                403
            );
        }
        
        // Continue to the next middleware or function
        next();
    } catch (err) {
        logger.error(`Error in verifyRole: ${err}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});