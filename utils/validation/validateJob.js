import Joi from 'joi';
import { JOB_WORKING_MODE, REASON_FOR_HIRE, SHIFT } from '../../config/index.js';

export const validateJobData = (job) => {
    const jobSchema = Joi.object({
        jobTemplate: Joi.string().length(24).hex().required().messages({
            'string.length': `"jobTemplate" must be a 24-character hex string`,
            'string.hex': `"jobTemplate" must be a hex string`,
            'any.required': `"jobTemplate" is a required field`
        }),
        hiringManager: Joi.string().length(24).hex().required().messages({
            'string.length': `"hiringManager" must be a 24-character hex string`,
            'string.hex': `"hiringManager" must be a hex string`,
            'any.required': `"hiringManager" is a required field`
        }),
        workLocation: Joi.string().length(24).hex().required().messages({
            'string.length': `"workLocation" must be a 24-character hex string`,
            'string.hex': `"workLocation" must be a hex string`,
            'any.required': `"workLocation" is a required field`
        }),
        department: Joi.string().length(24).hex().required().messages({
            'string.length': `"department" must be a 24-character hex string`,
            'string.hex': `"department" must be a hex string`,
            'any.required': `"department" is a required field`
        }),
        numOfOpenings: Joi.number().default(1),
        workingMode: Joi.string().valid(
            JOB_WORKING_MODE.Remote,
            JOB_WORKING_MODE.Onsite,
            JOB_WORKING_MODE.Hybrid
        ).required(),
        reasonForHire: Joi.string().valid(REASON_FOR_HIRE.Expansion, REASON_FOR_HIRE.Replacement).required(),
        shift: Joi.string().valid(SHIFT.First, SHIFT.Second, SHIFT.Third, SHIFT.General).required(),
        shiftStartTime: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3])$/) // Regex pattern to ensure format and range
            .messages({
                'string.pattern.base': `"shiftStartTime" must be in the format of HH with a range between 00 to 23`,
            }),
        shiftEndTime: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3])$/) // Regex pattern to ensure format and range
            .messages({
                'string.pattern.base': `"shiftEndTime" must be in the format of HH with a range between 00 to 23`,
            }),
        min_budget: Joi.number(),
        max_budget: Joi.number(),
        min_experience: Joi.number(),
        max_experience: Joi.number()
    });
    return jobSchema.validate(job);
}

/*export const validateTemplateUpdateData = (template) => {
    const templateSchema = Joi.object({
        title: Joi.string().min(2).max(50),
        subtitle: Joi.string().min(2).max(50),
        description: Joi.string().max(500).allow('', null),
        categoryId: Joi.string().length(24).hex().messages({
            'string.length': `"jobCategoryId" must be a 24-character hex string`,
            'string.hex': `"jobCategoryId" must be a hex string`,
        }),
        status: Joi.number().valid(0, 1)
    }).min(1); // At least one field is required for update

    return templateSchema.validate(template);
};*/