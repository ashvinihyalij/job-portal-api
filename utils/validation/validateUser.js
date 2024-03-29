import Joi from 'joi';
import { ROLES } from '../../config/index.js';

export const validateUserData = (user) => {
    const userSchema = Joi.object({
        firstName: Joi.string().min(2).max(35).required(),
        lastName: Joi.string().min(2).max(35).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(35).required(),
        role: Joi.string().valid(ROLES.SuperAdmin, ROLES.HiringManager, ROLES.Recruiter).required().messages({
            'string.base': `"role" should be a type of 'text'`,
            'any.required': `"role" is a required field`,
            'any.only': `Invalid role`
        }),
    });
    return userSchema.validate(user);
}

export const validateLoginData = (user) => {
    const userSchema = Joi.object({        
        email: Joi.string().email().required(),
        password: Joi.string().required()        
    });
    return userSchema.validate(user);
}

export const validateResetPwdData = (resetPwd) => {    
    const resetPwdSchema = Joi.object({        
        email: Joi.string().email().required(),               
    });
    return resetPwdSchema.validate(resetPwd);
}
