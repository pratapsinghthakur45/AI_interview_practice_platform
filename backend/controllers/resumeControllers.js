import Resume from "../models/resume.js"; // Adjust path to your model
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure 'uploads' directory exists on local server storage
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  let ext = path.extname(file.originalname);

  // Fallback if the original filename lacks an extension
  if (!ext) {
    ext = ".pdf";
  }

  cb(null, `resume-${uniqueSuffix}${ext}`);
},
});

// 2. File Filter for PDFs Only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 3. Controller to Save to MongoDB
export const uploadResume = async (req, res) => {
  try {
    // Check if file was provided by Multer
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file." });
    }

    // Get user ID from authentication middleware (req.user) or body
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Map Multer file metadata to your Mongoose Resume model
    const newResume = new Resume({
      user: userId,
      originalName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    });

    // Save record to MongoDB database
    const savedResume = await newResume.save();

    res.status(201).json({
      message: "Resume saved to MongoDB successfully",
      data: savedResume,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save resume in MongoDB",
      error: error.message,
    });
  }
};

//controller to get resume
export const getResume = async (req, res) => {
  try {

    
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume record not found in database" });
    }

    // Resolve absolute path
    const absolutePath = path.resolve(resume.filePath);

    // Debugging logs to inspect in your terminal
    console.log("DB File Path:", resume.filePath);
    console.log("Looking for file at:", absolutePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ 
        message: "PDF file missing on server disk",
        expectedPath: absolutePath 
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${resume.originalName}"`);

    res.sendFile(absolutePath);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving resume", error: error.message });
  }
};



// ... existing uploadResume and getResume controllers ...

// Update Resume (Replaces old file on disk if a new file is uploaded)
export const updateResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user?.id || req.body.userId; // Assumes auth middleware sets req.user

    // 1. Find the existing resume record belonging to the user
    const existingResume = await Resume.findOne({ _id: resumeId, user: userId });

    if (!existingResume) {
      // Clean up newly uploaded temporary file if ownership/record check fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // 2. If a new file is uploaded, delete the old file from disk
    if (req.file) {
      const oldPath = path.resolve(existingResume.filePath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      // Update file fields with new Multer file details
      existingResume.originalName = req.file.originalname;
      existingResume.filePath = req.file.path;
      existingResume.mimeType = req.file.mimetype;
    }

    // 3. Save the updated record to MongoDB
    const updatedResume = await existingResume.save();

    res.status(200).json({
      message: "Resume updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    // Cleanup newly uploaded file on internal error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      message: "Failed to update resume",
      error: error.message,
    });
  }
};



// ... existing controllers (uploadResume, getResume, updateResume) ...

// Delete Resume Controller
export const deleteResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // 1. Find the resume document in MongoDB
    const resume = await Resume.findOne({ _id: resumeId, user: userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // 2. Delete the physical PDF file from disk
    const absolutePath = path.resolve(resume.filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    // 3. Delete the record from MongoDB
    await Resume.findByIdAndDelete(resumeId);

    res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete resume",
      error: error.message,
    });
  }
};