import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";
import {
    handleValidationError,
    handleSuccessResponse,
    handleErrorResponse
} from "../../utils/apiResponse.js";
import { validateTemplateData, validateTemplateUpdateData } from '../../utils/validation/validateTemplate.js';
import logger from '../../utils/winston/index.js';
import { createTemplate, getTemplateById, updateTemplate } from '../../services/jobService.js'
import { makeObjectSelected } from '../../utils/common.js';

/**
 * @route POST v1/job/template
 * @url http://localhost:8080/api/v1/job/template
 * @desc adds job template
 * @access Private => msp superadmin
 */
export const addTemplate = asyncHandler(async (req, res, next) => {
        let params = req.body;
        const { error } = validateTemplateData(params);        
        if (error) {
            handleValidationError(res, error.details[0].message);
        }

    try {
        params.user = req.user;
        const template = await createTemplate(params);
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus', 'category', 'user']);
        handleSuccessResponse(
            res,
            "Job template added successfully.",
            [templateData]
        );
    } catch (err) {
        logger.error(`Error in addTemplate: ${err}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

/**
 * @route PUT v1/job/template/{templateId}
 * @url http://localhost:8080/api/v1/job/template/{templateId}
 * @desc Edits job template
 * @access Private => msp superadmin
 */
export const editTemplate = asyncHandler(async (req, res, next) => {
    const templateId = req.params.templateId;
    if (!templateId || !mongoose.isValidObjectId(templateId)) {
        return handleValidationError(res, 'Invalid or missing template ID');
    }
    const params = req.body;
    const { error } = validateTemplateUpdateData(params);
    if (error) {
        handleValidationError(res, error.details[0].message);
    }
    try {
        const template = await updateTemplate(templateId, params);
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus', 'category', 'user']);
        handleSuccessResponse(
            res,
            "Job template updated successfully.",
            [templateData]
        );
    } catch (error) {
        logger.error(`Error in editTemplate: ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

/**
 * @route GET v1/job/template/{templateId}
 * @url http://localhost:8080/api/v1/job/template/{templateId}
 * @desc Gets job template
 * @access Private => any logged in user
 */
export const getTemplate = asyncHandler(async (req, res, next) => {
    const templateId = req.params.templateId;
    if (!templateId || !mongoose.isValidObjectId(templateId)) {
        return handleValidationError(res, 'Invalid or missing template ID');
    }
    try {
        const template = await getTemplateById(templateId);
        if (!template) {
            return handleErrorResponse(res, 'Template not found', 404);
        }
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus', 'category', 'user']);
        handleSuccessResponse(
            res,
            "Job Template retrieved successfully.",
            [templateData]
        );
    } catch (error) {
        logger.error(`Error in getTemplate: ${error}`);
        handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

/**
 * @route DELETE v1/job/template/{templateId}
 * @url http://localhost:8080/api/v1/job/template/{templateId}
 * @desc Deletes job template
 * @access Private => msp superadmin
 */
export const deleteTemplate = asyncHandler(async (req, res, next) => {
    const templateId = req.params.templateId;
    if (!templateId || !mongoose.isValidObjectId(templateId)) {
        return handleValidationError(res, 'Invalid or missing template ID');
    }

    try {
        const template = await getTemplateById(templateId);
        if (!template) {
            return handleErrorResponse(res, 'Template not found', 404);
        }
        // Soft delete the template
        await template.softDelete();

        handleSuccessResponse(
            res,
            "Job Template deleted successfully.",
        );
    } catch (error) {
        logger.error(`Error in deleteTemplate: ${error}`);
        handleErrorResponse(
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