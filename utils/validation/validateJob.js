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
        shift: Joi.object({
            shift: Joi.string().valid(SHIFT.First, SHIFT.Second, SHIFT.Third, SHIFT.General),
            startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
                'string.pattern.base': `"startTime" must be in the format of HH:MM with a range between 00:00 to 23:59`,
            }),
            endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
                'string.pattern.base': `"endTime" must be in the format of HH:MM with a range between 00:00 to 23:59`,
            })
        }),
        budget: Joi.object({
            min: Joi.number().default(null),
            max: Joi.number().default(null)
        }).default(null),
        experience: Joi.object({
            min: Joi.number().default(null),
            max: Joi.number().default(null)
        }).default(null),
        skills: Joi.array().items(Joi.string().trim().lowercase().min(1)).min(1)
    });
    return jobSchema.validate(job);
}

export const validateJobUpdateData = (job) => {
    const jobSchema = Joi.object({
        jobTemplate: Joi.string().length(24).hex().messages({
            'string.length': `"jobTemplate" must be a 24-character hex string`,
            'string.hex': `"jobTemplate" must be a hex string`,
            'any.required': `"jobTemplate" is a required field`
        }),
        hiringManager: Joi.string().length(24).hex().messages({
            'string.length': `"hiringManager" must be a 24-character hex string`,
            'string.hex': `"hiringManager" must be a hex string`,
            'any.required': `"hiringManager" is a required field`
        }),
        workLocation: Joi.string().length(24).hex().messages({
            'string.length': `"workLocation" must be a 24-character hex string`,
            'string.hex': `"workLocation" must be a hex string`,
            'any.required': `"workLocation" is a required field`
        }),
        department: Joi.string().length(24).hex().messages({
            'string.length': `"department" must be a 24-character hex string`,
            'string.hex': `"department" must be a hex string`,
            'any.required': `"department" is a required field`
        }),
        numOfOpenings: Joi.number(),
        workingMode: Joi.string().valid(
            JOB_WORKING_MODE.Remote,
            JOB_WORKING_MODE.Onsite,
            JOB_WORKING_MODE.Hybrid
        ),
        reasonForHire: Joi.string().valid(REASON_FOR_HIRE.Expansion, REASON_FOR_HIRE.Replacement),
        shift: Joi.object({
            shift: Joi.string().valid(SHIFT.First, SHIFT.Second, SHIFT.Third, SHIFT.General),
            startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
                'string.pattern.base': `"startTime" must be in the format of HH:MM with a range between 00:00 to 23:59`,
            }),
            endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
                'string.pattern.base': `"endTime" must be in the format of HH:MM with a range between 00:00 to 23:59`,
            })
        }),
        budget: Joi.object({
            min: Joi.number(),
            max: Joi.number()
        }),
        experience: Joi.object({
            min: Joi.number(),
            max: Joi.number()
        }),
        skills: Joi.array().items(Joi.string().trim().lowercase().min(1)).min(1)
    }).min(1); // At least one field is required for update
    return jobSchema.validate(job);
};

export const validateJobReleaseData = (job) => {
    const schema = Joi.object({
        released: Joi.array().items(Joi.object({
            to: Joi.string().length(24).hex().required().messages({
                'string.length': `"to" must be a 24-character hex string`,
                'string.hex': `"to" must be a hex string`,
                'any.required': `"to" is a required field`
            }),
            date: Joi.date().iso().optional().messages({ // Make `date` optional
                'date.iso': `"date" must be in ISO 8601 date format`
            })
        })).required().messages({
            'array.min': `"released" must contain at least one entry`,
            'any.required': `"released" is a required field`
        })
    });

    return schema.validate(job);
};