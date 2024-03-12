import express from "express";
import { register, verifyEmail } from "../controllers/auth/authController.js";

const router = express.Router();

router.post('/register', register);
router.get('/verify/:userId/:token', verifyEmail);
export default router;