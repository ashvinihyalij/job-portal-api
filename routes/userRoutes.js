import express from "express";
import { getProfile } from "../controllers/user/userController.js";
import {verify, verifyRole} from '../middelwares/validateTokenHandler.js';

const router = express.Router();



router.get('/profile', verify, getProfile);


export default router;