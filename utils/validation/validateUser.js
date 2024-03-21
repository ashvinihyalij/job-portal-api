import Joi from 'joi';

export const validateUserData = (user) => {
    const userSchema = Joi.object({
        firstName: Joi.string().min(2).max(35).required(),
        lastName: Joi.string().min(2).max(35).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(35).required(),
        roleStatus: Joi.number().valid(1, 2).default(2)
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
