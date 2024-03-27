import JobTemplate from "../models/JobTemplate.js";

export const createTemplate = async (params) => {
    const templateObject = createTemplateObject(params);
    const savedTemplate = await templateObject.save();

    // Populate the jobCategoryId and userId fields of the saved JobTemplate object
    return await JobTemplate.findById(savedTemplate._id)
    .populate('category', 'title')
    .populate('user', 'firstName lastName joined');    
};

export const updateTemplate = async (templateId, params) => {
    
    const updatedTemplate = await JobTemplate.findByIdAndUpdate(
        templateId,
        params,
        { new: true } // Return the updated document
    );

    // Populate the category and user fields of the saved JobTemplate object
    return await JobTemplate.findById(updatedTemplate._id)
    .populate('category', 'title')
    .populate('user', 'firstName lastName joined');
};

export const getTemplateById = async (templateId) => {
    return await JobTemplate.findById(templateId)
            .populate('category', 'title')
            .populate('user', 'firstName lastName joined');    
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