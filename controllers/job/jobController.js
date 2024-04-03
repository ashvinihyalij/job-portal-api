import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";
import * as handleResponse from '../../utils/apiResponse.js';
import {
    validateJobData,
    validateJobUpdateData,
    validateJobReleaseData
} from '../../utils/validation/validateJob.js';
import logger from '../../utils/winston/index.js';
import * as jobService from '../../services/jobService.js';
//import { makeObjectSelected } from '../../utils/common.js';
import { ROLES } from '../../config/index.js';
//import job from "../../models/job.js";

export const addJob = asyncHandler(async (req, res, next) => {
    let params = req.body;
    const { error } = validateJobData(params);
    if (error) {
        handleResponse.handleValidationError(res, error.details[0].message);
    }

    try {
        params.user = req.user;
        const jobObject = await jobService.createJob(params);
        const jobData = jobService.makeJobResponse(jobObject);
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

export const editJob = asyncHandler(async (req, res, next) => {
    const jobId = req.params.jobId;
    if (!jobId || !mongoose.isValidObjectId(jobId)) {
        handleResponse.handleValidationError(res, 'Invalid or missing job ID');
    }
    const params = req.body;

    const { error } = validateJobUpdateData(params);
    if (error) {
        handleResponse.handleValidationError(res, error.details[0].message);
    }
    const allowed = await jobService.canEdit(jobId, req.user);
    if (!allowed) {
        return handleResponse.handleErrorResponse(
            res,
            "Forbidden - You don't have permission to perform this operation.",
            403
        );
    }
    try {
        params.user = req.user;
        const jobDoc = await jobService.updateJob(jobId, params);
        const jobData = jobService.makeJobResponse(jobDoc);

        handleResponse.handleSuccessResponse(
            res,
            "Job updated successfully.",
            [jobData]
        );
    } catch (error) {
        logger.error(`Error in editjob: ${error}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const getJob = asyncHandler(async (req, res, next) => {
    const jobId = req.params.jobId;
    if (!jobId || !mongoose.isValidObjectId(jobId)) {
        handleResponse.handleValidationError(res, 'Invalid or missing job ID');
    }
    try {
        const jobDoc = await jobService.getJobById(jobId);
        if (!jobDoc) {
            return handleResponse.handleErrorResponse(res, 'Job not found', 404);
        }
        const jobData = jobService.makeJobResponse(jobDoc);
        handleResponse.handleSuccessResponse(
            res,
            "Job retrieved successfully.",
            [jobData]
        );
    } catch (error) {
        logger.error(`Error in getJob: ${error}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});

export const releaseJob = asyncHandler(async (req, res, next) => {
    const jobId = req.params.jobId;
    if (!jobId || !mongoose.isValidObjectId(jobId)) {
        handleResponse.handleValidationError(res, 'Invalid or missing job ID');
    }
    const params = req.body;

    const { error } = validateJobReleaseData(params);
    if (error) {
        handleResponse.handleValidationError(res, error.details[0].message);
    }
    params.released.forEach(release => {
        if (!release.date) {
            // Set date to current date and time if not provided
            release.date = new Date().toISOString();
        }
    });
    try {
        const jobDoc = await jobService.getJobById(jobId);
        if (!jobDoc) {
            return handleResponse.handleErrorResponse(res, 'Job not found', 404);
        }

        params.released.forEach(newRelease => {
            const exists = jobDoc.released.some(release => release.to.toString() === newRelease.to);
            if (!exists) {
                jobDoc.released.push(newRelease);
            }
        });
        const jobData = await jobService.releaseJobToRecruiter(jobDoc);

        handleResponse.handleSuccessResponse(
            res,
            "Job retrieved successfully.",
            [jobData]
        );
    } catch (error) {
        logger.error(`Error in releaseJob: ${error}`);
        handleResponse.handleErrorResponse(
            res,
            "Internal Server Error"
        );
    }
});