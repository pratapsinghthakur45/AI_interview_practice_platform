import express from "express";
import {
    createInterviewTurn,
    getInterviewTurns,
    submitAnswer
} from "../controllers/interviewTurnController.js";

import authMiddleware from "../middlewares/jwtAuth.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const router = express.Router();

// Create question
router.post(
    "/interviews/:id/turns",
    jwtAuth,
    createInterviewTurn
);

// Get all questions/answers
router.get(
    "/interviews/:id/turns",
    jwtAuth,
    getInterviewTurns
);

// Submit answer
router.patch(
    "/interviews/:id/turns/:turnId/answer",
    jwtAuth,
    submitAnswer
);

export default router;