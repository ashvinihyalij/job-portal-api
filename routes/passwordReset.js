import express from "express";
import { requestResetPwd, resetPassword } from "../controllers/passwordResetController.js";

const router = express.Router();

router.post('/', requestResetPwd);
router.post('/:userId/:token', resetPassword);



export default router;