import Token from '../models/token.js';
import crypto from "crypto";
import logger from '../utils/winston/index.js';

export const getToken = async (objectParams) => {
    try {
        return await Token.findOne(objectParams);
    } catch (error) {
        logger.error(`Error in getToken: ${error}`);
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
        logger.error(`Error in createToken: ${error}`);
    }
};

export const deleteToken = async (id) => {
    try {
        await Token.deleteOne({ _id: id });
    } catch (error) {
        logger.error(`Error in removeToken: ${error}`);
    }
};