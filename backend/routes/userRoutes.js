import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.js';
import {signup,login, profile, updateProfile, changePassword} from "../controllers/userControllers.js";

const router = express.Router();

router.post('/signup',signup);

router.post('/login',login);

router.get('/profile',jwtAuth,profile);

router.put('/profile',jwtAuth,updateProfile);

router.put('/profile/changePassword',jwtAuth,changePassword);

export default router;