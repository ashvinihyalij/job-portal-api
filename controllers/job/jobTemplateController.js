import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";
import * as handleErrors from '../../utils/apiResponse.js';
import { validateTemplateData, validateTemplateUpdateData } from '../../utils/validation/validateTemplate.js';
import logger from '../../utils/winston/index.js';
import { createTemplate, getTemplateById, updateTemplate } from '../../services/jobService.js'
import { makeObjectSelected } from '../../utils/common.js';

export const addTemplate = asyncHandler(async (req, res, next) => {
        let params = req.body;
        const { error } = validateTemplateData(params);
        if (error) {
            handleErrors.handleValidationError(res, error.details[0].message);
        }

    try {
        params.user = req.user;
        const template = await createTemplate(params);
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus', 'category', 'user']);
        handleErrors.handleSuccessResponse(
            res,
            "Job template added successfully.",
            [templateData]
        );
    } catch (err) {
        logger.error(`Error in addTemplate: ${err}`);
        handleErrors.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const editTemplate = asyncHandler(async (req, res, next) => {
    const templateId = req.params.templateId;
    if (!templateId || !mongoose.isValidObjectId(templateId)) {
        return handleErrors.handleValidationError(res, 'Invalid or missing template ID');
    }
    const params = req.body;
    const { error } = validateTemplateUpdateData(params);
    if (error) {
        handleErrors.handleValidationError(res, error.details[0].message);
    }
    try {
        const template = await updateTemplate(templateId, params);
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus', 'category', 'user']);
        handleErrors.handleSuccessResponse(
            res,
            "Job template updated successfully.",
            [templateData]
        );
    } catch (error) {
        logger.error(`Error in editTemplate: ${error}`);
        handleErrors.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const getTemplate = asyncHandler(async (req, res, next) => {
    const templateId = req.params.templateId;
    if (!templateId || !mongoose.isValidObjectId(templateId)) {
        return handleErrors.handleValidationError(res, 'Invalid or missing template ID');
    }
    try {
        const template = await getTemplateById(templateId);
        if (!template) {
            return handleErrors.handleErrorResponse(res, 'Template not found', 404);
        }
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus', 'category', 'user']);
        handleErrors.handleSuccessResponse(
            res,
            "Job Template retrieved successfully.",
            [templateData]
        );
    } catch (error) {
        logger.error(`Error in getTemplate: ${error}`);
        handleErrors.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const deleteTemplate = asyncHandler(async (req, res, next) => {
    const templateId = req.params.templateId;
    if (!templateId || !mongoose.isValidObjectId(templateId)) {
        return handleErrors.handleValidationError(res, 'Invalid or missing template ID');
    }

    try {
        const template = await getTemplateById(templateId);
        if (!template) {
            return handleErrors.handleErrorResponse(res, 'Template not found', 404);
        }
        // Soft delete the template
        await template.softDelete();

        handleErrors.handleSuccessResponse(
            res,
            "Job Template deleted successfully.",
        );
    } catch (error) {
        logger.error(`Error in deleteTemplate: ${error}`);
        handleErrors.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const getTemplates = asyncHandler(async (req, res, next) => {
    try {
        console.log('in get templates controller');
    } catch (error) {

    }
});