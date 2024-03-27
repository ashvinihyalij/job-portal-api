import express from "express";
import * as jobTemplateController from "../../controllers/job/jobTemplateController.js";
import {verify, verifyAdmin} from '../../middelwares/validateTokenHandler.js';

const router = express.Router();

/**
 * @route POST v1/job/template
 * @url http://localhost:8080/api/v1/job/template
 * @desc adds job template
 * @access Private => msp superadmin
 */
router.post('/template', verify, verifyAdmin, jobTemplateController.addTemplate);

/**
 * @route PUT v1/job/template/{templateId}
 * @url http://localhost:8080/api/v1/job/template/{templateId}
 * @desc Edits job template
 * @access Private => msp superadmin
 */
router.put('/template/:templateId', verify, verifyAdmin, jobTemplateController.editTemplate);

/**
 * @route DELETE v1/job/template/{templateId}
 * @url http://localhost:8080/api/v1/job/template/{templateId}
 * @desc Deletes job template
 * @access Private => msp superadmin
 */
router.delete('/template/:templateId', verify, verifyAdmin, jobTemplateController.deleteTemplate);

/**
 * @route GET v1/job/template/{templateId}
 * @url http://localhost:8080/api/v1/job/template/{templateId}
 * @desc Gets job template
 * @access Private => any logged in user
 */
router.get('/template/:templateId', verify, jobTemplateController.getTemplate);

// Get all templates
router.get('/template', jobTemplateController.getTemplates);


export default router;