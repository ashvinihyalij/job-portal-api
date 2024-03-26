import JobTemplate from "../models/JobTemplate.js";

export const createTemplate = async (params) => {
    const templateObject = createTemplateObject(params);
    const savedTemplate = await templateObject.save();

    // Populate the jobCategoryId and userId fields of the saved JobTemplate object
    const populatedTemplate = await JobTemplate.findById(savedTemplate._id)
    .populate('category', 'title')
    .populate('user', 'firstName lastName joined');

    // Return the populated JobTemplate object
    return populatedTemplate;
};

export const getTemplateById = async (templateId) => {
    const template = await JobTemplate.findById(templateId)
            .populate('category', 'title')
            .populate('user', 'firstName lastName joined');

    // Return the populated JobTemplate object
    return template;
};

const createTemplateObject = (params) => {
    const template = new JobTemplate({
        title: params.title,
        subtitle: params.subtitle,
        description: params.description ?? null,
        category: params.categoryId,
        user: params.user.id,
        templateStatus: 1
    });
    return template;
}