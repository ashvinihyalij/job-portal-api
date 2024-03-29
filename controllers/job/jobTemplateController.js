import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";
import * as handleResponse from '../../utils/apiResponse.js';
import { validateTemplateData, validateTemplateUpdateData } from '../../utils/validation/validateTemplate.js';
import logger from '../../utils/winston/index.js';
import * as jobService from '../../services/jobService.js';
import { makeObjectSelected } from '../../utils/common.js';
import JobTemplate from "../../models/JobTemplate.js";

export const addTemplate = asyncHandler(async (req, res, next) => {
        let params = req.body;
        const { error } = validateTemplateData(params);
        if (error) {
            handleResponse.handleValidationError(res, error.details[0].message);
        }

    try {
        params.user = req.user;
        const template = await jobService.createTemplate(params);
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus', 'category', 'user']);
        handleResponse.handleSuccessResponse(
            res,
            "Job template added successfully.",
            [templateData]
        );
    } catch (err) {
        logger.error(`Error in addTemplate: ${err}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const editTemplate = asyncHandler(async (req, res, next) => {
    const templateId = req.params.templateId;
    if (!templateId || !mongoose.isValidObjectId(templateId)) {
        handleResponse.handleValidationError(res, 'Invalid or missing template ID');
    }
    const params = req.body;
    const { error } = validateTemplateUpdateData(params);
    if (error) {
        handleResponse.handleValidationError(res, error.details[0].message);
    }
    try {
        const template = await jobService.updateTemplate(templateId, params);
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus', 'category', 'user']);
        handleResponse.handleSuccessResponse(
            res,
            "Job template updated successfully.",
            [templateData]
        );
    } catch (error) {
        logger.error(`Error in editTemplate: ${error}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const getTemplate = asyncHandler(async (req, res, next) => {
    const templateId = req.params.templateId;
    if (!templateId || !mongoose.isValidObjectId(templateId)) {
        handleResponse.handleValidationError(res, 'Invalid or missing template ID');
    }
    try {
        const template = await jobService.getTemplateById(templateId);
        if (!template) {
            return handleResponse.handleErrorResponse(res, 'Template not found', 404);
        }
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus', 'category', 'user']);
        handleResponse.handleSuccessResponse(
            res,
            "Job Template retrieved successfully.",
            [templateData]
        );
    } catch (error) {
        logger.error(`Error in getTemplate: ${error}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const deleteTemplate = asyncHandler(async (req, res, next) => {
    const templateId = req.params.templateId;
    if (!templateId || !mongoose.isValidObjectId(templateId)) {
        return handleResponse.handleValidationError(res, 'Invalid or missing template ID');
    }

    try {
        const template = await jobService.getTemplateById(templateId);
        if (!template) {
            return handleResponse.handleErrorResponse(res, 'Template not found', 404);
        }
        // Soft delete the template
        await template.softDelete();

        handleResponse.handleSuccessResponse(
            res,
            "Job Template deleted successfully.",
        );
    } catch (error) {
        logger.error(`Error in deleteTemplate: ${error}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const getTemplates = asyncHandler(async (req, res, next) => {
    try {
        const templates = await jobService.getPaginatedTemplates(req);
        handleResponse.handleSuccessResponse(
            res,
            "Job Templates retrieved successfully.",
            templates.docs,
            {
                totalDocs: templates.totalDocs,
                totalPages: templates.totalPages,
                currentPage: templates.page,
            }
        );
        
    } catch (error) {
        logger.error(`Error in getTemplates: ${error}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const getDropdownTemplates = asyncHandler(async (req, res, next) => {
    try {
        const templates = await jobService.getAllTemplates();
        console.log(templates);
        handleResponse.handleSuccessResponse(
            res,
            "Job template listing retrieved successfully.",
            templates
        );
        
    } catch (error) {
        logger.error(`Error in getDropdownTemplates: ${error}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});