import asyncHandler from "express-async-handler";
import {
    handleValidationError,
    handleSuccessResponse,
    handleErrorResponse
} from "../../utils/apiResponse.js";
import { validateTemplateData } from '../../utils/validation/validateTemplate.js';
import logger from '../../utils/winston/index.js';
import { createTemplate } from '../../services/jobService.js'
import { makeObjectSelected } from '../../utils/common.js';
/**
 * @route POST v1/job/template
 * @url http://localhost:8080/api/v1/job/template
 * @desc adds job template
 * @access Private
 */
export const addTemplate = asyncHandler(async (req, res, next) => {    
        const params = req.body;
        const { error } = validateTemplateData(params);        
        if (error) {
            handleValidationError(res, error.details[0].message);
        }

    try {
        const template = await createTemplate(params);
        let templateData = makeObjectSelected(template, ['_id', 'title', 'subtitle', 'description', 'templateStatus']);
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

export const editTemplate = asyncHandler(async (req, res, next) => {
    try {
        console.log('in edit template controller');
    } catch (error) {

    }
});

export const getTemplate = asyncHandler(async (req, res, next) => {
    try {
        console.log('in get template controller');
    } catch (error) {

    }
});

export const deleteTemplate = asyncHandler(async (req, res, next) => {
    try {
        console.log('in delete template controller');
    } catch (error) {

    }
});

export const getTemplates = asyncHandler(async (req, res, next) => {
    try {
        console.log('in get templates controller');
    } catch (error) {

    }
});