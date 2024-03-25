import Joi from 'joi';

export const validateTemplateData = (template) => {
    const templateSchema = Joi.object({
        title: Joi.string().min(2).max(50).required(),
        subtitle: Joi.string().min(2).max(50).required(),
        description: Joi.string().max(500).allow('', null),
        categoryId: Joi.string().length(24).hex().required().messages({
            'string.length': `"jobCategoryId" must be a 24-character hex string`,
            'string.hex': `"jobCategoryId" must be a hex string`,
            'any.required': `"jobCategoryId" is a required field`
        }),
        status: Joi.number().valid(0, 1, 2).default(1)
    });
    return templateSchema.validate(template);
}