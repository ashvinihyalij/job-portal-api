import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";
import * as handleResponse from '../../utils/apiResponse.js';
//import { validateTemplateData, validateTemplateUpdateData } from '../../utils/validation/validateTemplate.js';
import { validateJobData } from '../../utils/validation/validateJob.js';
import logger from '../../utils/winston/index.js';
import * as jobService from '../../services/jobService.js';
import { makeObjectSelected } from '../../utils/common.js';
//import JobTemplate from "../../models/JobTemplate.js";

export const addJob = asyncHandler(async (req, res, next) => {
    let params = req.body;
    const { error } = validateJobData(params);
    if (error) {
        handleResponse.handleValidationError(res, error.details[0].message);
    }

    try {
        params.user = req.user;
        const jobObject = await jobService.createJob(params);
        let jobData = makeObjectSelected(jobObject, ['_id', 'jobTemplate', 'hiringManager', 'workLocation', 'department', 'numOfOpenings', 'workingMode', 'reasonForHire', 'shift', 'shiftStartTime', 'shiftEndTime', 'budget', 'experience', 'jobStatus', 'createdBy', 'createdType']);
        handleResponse.handleSuccessResponse(
            res,
            "Job added successfully.",
            [jobData]
        );
    } catch (err) {
        logger.error(`Error in addJob: ${err}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});