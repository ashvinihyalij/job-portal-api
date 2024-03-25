import jobTemplate from "../models/JobTemplate.js";
import logger from '../utils/winston/index.js';
import { handleErrorResponse } from "../utils/apiResponse.js";
export const createTemplate = async (params) => {
    const templateObject = createTemplateObject(params);
    return await templateObject.save();
};

const createTemplateObject = (params) => {
    const template = new jobTemplate({
        title: params.title,
        subtitle: params.subtitle,
        description: params.description ?? null,
        jobCategoryId: params.categoryId,
        userId: '65fc2e9ec0e7f38a7880f52f',//params.user.id,
        templateStatus: 1
    });
    return template;
}