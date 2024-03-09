import Joi from 'joi';

export const validateUserData = (user) => {
    const userSchema = Joi.object({
        name: Joi.string().min(2).max(35).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(35).required(),
        location: Joi.string().min(2).max(35)
    });
    return userSchema.validate(user);
}

export const validateResetPwdData = (resetPwd) => {    
    const resetPwdSchema = Joi.object({        
        email: Joi.string().email().required(),               
    });
    return resetPwdSchema.validate(resetPwd);
}
