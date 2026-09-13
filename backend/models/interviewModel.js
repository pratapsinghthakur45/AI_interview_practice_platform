import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true
        },

        jobDescription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JD",
            required: false
        },

        interviewType: {
            type: String,
            enum: ["technical", "hr"],
            required: true
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true
        },

        status: {
            type: String,
            enum: ["created", "in-progress", "completed", "cancelled"],
            default: "created"
        },

        startedAt: {
            type: Date,
            default: null
        },

        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;