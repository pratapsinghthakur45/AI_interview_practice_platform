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
    const userId = req.user?._id || req.body.userId;

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