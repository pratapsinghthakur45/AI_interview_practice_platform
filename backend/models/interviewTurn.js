
import mongoose from "mongoose";

const interviewTurnSchema = new mongoose.Schema(
    {
        interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
            required: true
        },

        question: {
            type: String,
            required: true,
            trim: true
        },

        answer: {
            type: String,
            default: "",
            trim: true
        },

        questionType: {
            type: String,
            enum: ["main", "follow-up"],
            default: "main"
        },

        sequence: {
            type: Number,
            required: true,
            min: 1
        },

        evaluation: {
            score: {
                type: Number,
                min: 0,
                max: 100,
                default: null
            },

            strengths: {
                type: [String],
                default: []
            },

            weaknesses: {
                type: [String],
                default: []
            },

            feedback: {
                type: String,
                default: ""
            }
        }
    },
    {
        timestamps: true
    }
);

const InterviewTurn = mongoose.model(
    "InterviewTurn",
    interviewTurnSchema
);

export default InterviewTurn;