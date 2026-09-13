import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.js';
import { createInterview, endInterview, getAllInterview, getInterview, startInterview } from '../controllers/interviewController.js';


const router = express.Router();

router.post('/createInterview',jwtAuth,createInterview);

router.get('/getInterview/:id',jwtAuth,getInterview);

router.get('/getAllInterview',jwtAuth,getAllInterview);

router.post('/interview/start/:id',jwtAuth,startInterview);

router.post('/interview/end/:id',jwtAuth,endInterview);


export default router;
