import express from "express";
import * as jobTemplateController from "../../controllers/job/jobTemplateController.js";
import { verify, verifyRole } from '../../middelwares/validateTokenHandler.js';
import { ROLES } from '../../config/index.js';
import * as jobController from "../../controllers/job/jobController.js";

const router = express.Router();

/**
 * @route POST v1/job/template
 * @url http://localhost:8080/api/v1/job/template
 * @desc adds job template
 * @access Private => msp superadmin
 */
router.post('/template', verify, verifyRole([ROLES.SuperAdmin]), jobTemplateController.addTemplate);

/**
 * @route PUT v1/job/template/{templateId}
 * @url http://localhost:8080/api/v1/job/template/{templateId}
 * @desc Edits job template
 * @access Private => msp superadmin
 */
router.put('/template/:templateId', verify, verifyRole([ROLES.SuperAdmin]), jobTemplateController.editTemplate);

/**
 * @route DELETE v1/job/template/{templateId}
 * @url http://localhost:8080/api/v1/job/template/{templateId}
 * @desc Deletes job template
 * @access Private => msp superadmin
 */
router.delete('/template/:templateId', verify, verifyRole([ROLES.SuperAdmin]), jobTemplateController.deleteTemplate);

/**
 * @route GET v1/job/template/{templateId}
 * @url http://localhost:8080/api/v1/job/template/{templateId}
 * @desc Gets job template
 * @access Private => any logged in user
 */
router.get('/template/:templateId', verify, verifyRole([ROLES.SuperAdmin, ROLES.HiringManager]), jobTemplateController.getTemplate);

/**
 * @route GET v1/job/template?page=1&filter=laravel
 * @url http://localhost:8080/api/v1/job/template?page=1&filter=laravel
 * @desc Gets job templates
 * @access Private => any logged in user
 */
router.get('/template', verify, verifyRole([ROLES.SuperAdmin, ROLES.HiringManager]), jobTemplateController.getTemplates);

/**
 * @route GET v1/job/templates/dropdown
 * @url http://localhost:8080/api/v1/job/templates/dropdown
 * @desc Gets all job templates
 * @access Private => any logged in user
 */
router.get('/templates/dropdown', verify, jobTemplateController.getDropdownTemplates);

/**
 * @route POST v1/job
 * @url http://localhost:8080/api/v1/job
 * @desc adds job
 * @access Private => superadmin/Hiring manager
 */
router.post('', verify, verifyRole([ROLES.SuperAdmin, ROLES.HiringManager]), jobController.addJob);

/**
 * @route PUT v1/job/{jobId}
 * @url http://localhost:8080/api/v1/job/{jobId}
 * @desc Edits job
 * @access Private => superadmin/Hiring manager
 */
router.put('/:jobId', verify, verifyRole([ROLES.SuperAdmin, ROLES.HiringManager]), jobController.editJob);

export default router;