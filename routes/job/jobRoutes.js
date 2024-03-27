import express from "express";
import * as jobTemplateController from "../../controllers/job/jobTemplateController.js";
import {verify, verifyAdmin} from '../../middelwares/validateTokenHandler.js';

const router = express.Router();

// Add a new template
router.post('/template', verify, verifyAdmin, jobTemplateController.addTemplate);

// Edit an existing template
router.put('/template/:templateId', verify, verifyAdmin, jobTemplateController.editTemplate);

// Delete a template
router.delete('/template/:templateId', verify, verifyAdmin, jobTemplateController.deleteTemplate);

// Get a single template
router.get('/template/:templateId', verify, jobTemplateController.getTemplate);

// Get all templates
router.get('/template', jobTemplateController.getTemplates);


export default router;