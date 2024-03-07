import Token from '../models/token.js';
import crypto from "crypto";

export const getToken = async (objectParams) => {
    try {
        return await Token.findOne(objectParams);
    } catch (error) {
        console.error("Error in getUser:", error);
    }
};

export const createToken = async (userId) => {
    try {
        const tokenData = {
            userId: userId,
            token: crypto.randomBytes(32).toString("hex"),
        };
        return await Token.create(tokenData);
    } catch (error) {
        console.error("Error in createToken:", error);
    }
};