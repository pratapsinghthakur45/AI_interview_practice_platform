import express from "express";
import { upload, uploadResume,getResume,updateResume ,deleteResume} from "../controllers/resumeControllers.js";
import jwtAuth from "../middlewares/jwtAuth.js";
// Import your authentication middleware here if needed (e.g., protectRoute)

const router = express.Router();

// POST route for uploading a single PDF resume
// Field name in form-data should be 'resume'
router.post("/uploadResume",jwtAuth, upload.single("resume"), uploadResume);

// GET route to view the PDF in browser by MongoDB ID
router.get("/resume/:id",jwtAuth, getResume);

// PUT route to update an existing resume by ID
router.put("/resume/:id", jwtAuth, upload.single("resume"), updateResume);

// DELETE route
router.delete("/resume/:id",jwtAuth, deleteResume);

export default router;