import InterviewTurn from "../models/interviewTurn.js";
import Interview from "../models/interviewModel.js";

// 1. Create a new interview turn/question
export const createInterviewTurn = async (req, res) => {
    try {
        const userId = req.user.id;
        const interviewId = req.params.id;

        const { question, questionType } = req.body;

        // Check interview belongs to logged-in user
        const interview = await Interview.findOne({
            _id: interviewId,
            user: userId
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        // Interview should be running
        if (interview.status !== "in-progress") {
            return res.status(400).json({
                message: "Interview is not in progress"
            });
        }

        if (!question) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        // Find last sequence number
        const lastTurn = await InterviewTurn.findOne({
            interview: interviewId
        }).sort({ sequence: -1 });

        const sequence = lastTurn ? lastTurn.sequence + 1 : 1;

        const newTurn = await InterviewTurn.create({
            interview: interviewId,
            question,
            questionType: questionType || "main",
            sequence
        });

        return res.status(201).json({
            message: "Interview question created successfully",
            turn: newTurn
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// 2. Get all turns of an interview
export const getInterviewTurns = async (req, res) => {
    try {
        const userId = req.user.id;
        const interviewId = req.params.id;

        // Check ownership
        const interview = await Interview.findOne({
            _id: interviewId,
            user: userId
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        const turns = await InterviewTurn.find({
            interview: interviewId
        }).sort({ sequence: 1 });

        return res.status(200).json({
            count: turns.length,
            turns
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// 3. Submit answer
export const submitAnswer = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, turnId } = req.params;
        const { answer } = req.body;

        if (!answer) {
            return res.status(400).json({
                message: "Answer is required"
            });
        }

        // Check interview belongs to user
        const interview = await Interview.findOne({
            _id: id,
            user: userId
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        if (interview.status !== "in-progress") {
            return res.status(400).json({
                message: "Interview is not in progress"
            });
        }

        // Find the turn
        const turn = await InterviewTurn.findOne({
            _id: turnId,
            interview: id
        });

        if (!turn) {
            return res.status(404).json({
                message: "Interview turn not found"
            });
        }

        turn.answer = answer;

        await turn.save();

        return res.status(200).json({
            message: "Answer submitted successfully",
            turn
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};