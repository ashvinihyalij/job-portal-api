import express from "express";
import { register, verifyEmail, login } from "../controllers/auth/authController.js";

const router = express.Router();

router.post('/register', register);
router.get('/verify/:userId/:token', verifyEmail);
router.post('/login', login);
export default router;