import JobTemplate from "../models/JobTemplate.js";
import job from "../models/job.js";
import { DEFAULT_PAGE_LIMIT, DEFAULT_SORT_FIELD, DEFAULT_SORT_ORDER, JOB_STATUS, ROLES } from '../config/index.js';
import crypto from "crypto";
import { makeObjectSelected } from '../utils/common.js';

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

export const createJob = async (params) => {
    const jobObject = createJobObject(params);
    const savedJob = await jobObject.save();
    return getJobDetails(savedJob._id);
};

export const getJobById = async (jobId, relatedModules = true) => {
    return await getJobDetails(jobId, relatedModules);
};

export const canEdit = async (jobId, user) => {
    const jobDetails = await job.findById(jobId);
    // Check if the logged-in user is a superadmin
    if (user.role === ROLES.SuperAdmin) {
        return true;
    }

    // Check if the job was created by the logged-in user
    if (jobDetails.createdBy.equals(user._id)) {
        return true;
    }

    return false;
};

export const updateJob = async (jobId, params) => {
    const updatedJob = await job.findByIdAndUpdate(
        jobId,
        params,
        { new: true } // Return the updated document
    );
    return getJobDetails(updatedJob._id);
};

export const makeJobResponse = (jobObject) => {
    return makeObjectSelected(jobObject, ['_id', 'jobTemplate', 'hiringManager', 'workLocation', 'department', 'numOfOpenings', 'workingMode', 'reasonForHire', 'shift', 'budget', 'experience', 'jobStatus', 'skills', 'createdBy', 'createdType']);
};

const getJobDetails = async (jobId, relatedModules = true) => {
    if (relatedModules) {
        return await job.findById(jobId)
            .populate({
                path: 'jobTemplate',
                select: 'title subtitle category',
                populate: {
                    path: 'category',
                    model: 'JobCategory',
                    select: 'title',
                }
            })
            .populate('hiringManager', 'firstName lastName joined')
            .populate('workLocation', 'name')
            .populate('department', 'name')
            .populate('createdBy', 'firstName lastName joined');
    }
    return await job.findById(jobId);
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

const createJobObject = (params) => {
    return new job({
        jobTemplate: params.jobTemplate,
        jobCode: `JC${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
        hiringManager: params.hiringManager,
        workLocation: params.workLocation,
        department: params.department,
        numOfOpenings: params.numOfOpenings ?? 1,
        workingMode: params.workingMode,
        reasonForHire: params.reasonForHire,
        shift: params.shift,
        shiftStartTime: params.shiftStartTime,
        shiftEndTime: params.shiftEndTime,
        budget: params.budget ?? null,
        experience: params.experience ?? null,
        createdBy: params.user.id,
        createdType: params.user.role,
        jobStatus: params.user.role === ROLES.SuperAdmin ? JOB_STATUS.Open : JOB_STATUS.Pending
    });
}