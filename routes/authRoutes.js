import express from "express";
import { register, verifyEmail, login } from "../controllers/auth/authController.js";
import {verify} from '../middelwares/validateTokenHandler.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify/:userId/:token', verifyEmail);
router.post('/login', login);

router.get("/user", verify, (req, res) => {
    console.log('inn route');
    console.log(req.user);
    res.status(200).json({
        status: "success",
        message: "Welcome to the your Dashboard!",
    });
});
export default router;