import express from "express";
import { upload, uploadResume,getResume } from "../controllers/resumeControllers.js";
// Import your authentication middleware here if needed (e.g., protectRoute)

const router = express.Router();

// POST route for uploading a single PDF resume
// Field name in form-data should be 'resume'
router.post("/upload", upload.single("resume"), uploadResume);

// GET route to view the PDF in browser by MongoDB ID
router.get("/resume/:id", getResume);

export default router;