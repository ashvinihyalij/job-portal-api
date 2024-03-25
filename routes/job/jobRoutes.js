import express from "express";
import * as jobTemplateController from "../../controllers/job/jobTemplateController.js";

const router = express.Router();

// Add a new template
router.post('/template', jobTemplateController.addTemplate);

// Edit an existing template
router.put('/template/:templateId', jobTemplateController.editTemplate);

// Delete a template
router.delete('/template/:templateId', jobTemplateController.deleteTemplate);

// Get a single template
router.get('/template/:templateId', jobTemplateController.getTemplate);

// Get all templates
router.get('/template', jobTemplateController.getTemplates);


export default router;