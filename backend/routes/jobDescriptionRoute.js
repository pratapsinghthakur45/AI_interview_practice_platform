import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.js';
import { createJD, deleteJD, getAllJD, getJD, updateJD } from '../controllers/jobDescriptionControllers.js';


const router = express.Router();

//create jd route
router.post('/createJd',jwtAuth,createJD);

//get all jds 
router.get('/jds',jwtAuth,getAllJD);

//get one jd
router.get('/jd/:id',jwtAuth,getJD);

//delete jd
router.delete('/deleteJD/:id',jwtAuth,deleteJD);

//update jd
router.put('/updateJD/:id',jwtAuth,updateJD);

export default router;
