import JobTemplate from "../models/JobTemplate.js";
import { DEFAULT_PAGE_LIMIT, DEFAULT_SORT_FIELD, DEFAULT_SORT_ORDER } from '../config/index.js';

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

export const getPaginatedTemplates = async (req) => {
    const {
        page = 1,
        limit = DEFAULT_PAGE_LIMIT,
        filter = '',
        sort = DEFAULT_SORT_FIELD,
        sortOrder = DEFAULT_SORT_ORDER,
        status
    } = req.query;

    let query = {
        $or: [
            { title: { $regex: filter, $options: 'i' } }, // Case-insensitive matching
            { subtitle: { $regex: filter, $options: 'i' } },
            { description: { $regex: filter, $options: 'i' } },
        ],
        is_deleted: { $ne: true }, // Exclude soft-deleted records
    };

    if (status) {
        switch (status.toLowerCase()) {
            case 'active':
                query.templateStatus = '1';
                break;
            case 'inactive':
                query.templateStatus = '0';
                break;
            default:
                break;        
        }
    }

    // Populate options for category and user
    const populateOptions = [
        { path: 'category', select: 'title' },
        { path: 'user', select: 'firstName lastName joined' }
    ];

    // Pagination calculation
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sort]: sortOrder === 'desc' ? -1 : 1 },
        populate: populateOptions,
        select: '-is_deleted'
    };

    const templates = await JobTemplate.paginate(query, options);

    templates.docs = templates.docs.map(template => ({
        ...template.toObject(), // Convert document to object
        templateStatus: template.templateStatus === '1' ? 'Active' : 'Inactive'
    }));

    return templates;
};
export const getAllTemplates = async () => {
    return await JobTemplate.find({}, 'title').sort({ title: 1 });
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