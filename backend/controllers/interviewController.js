import Interview from "../models/interviewModel.js";
import Resume from "../models/resume.js";
import JD from "../models/jobDescription.js";


//create user interview
export const createInterview = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            resumeId,
            jdId,
            interviewType,
            difficulty
        } = req.body;

        // Check required fields
        if (!resumeId || !interviewType || !difficulty) {
            return res.status(400).json({
                message: "Resume, Interview Type and Difficulty are required"
            });
        }

        // Check resume belongs to logged-in user
        const resume = await Resume.findOne({
            _id: resumeId,
            user: userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        // JD is optional
        if (jdId) {
            const jd = await JD.findOne({
                _id: jdId,
                user: userId
            });

            if (!jd) {
                return res.status(404).json({
                    message: "JD not found"
                });
            }
        }

        const newInterview = new Interview({
            user: userId,
            resume: resumeId,
            jobDescription: jdId || null,
            interviewType,
            difficulty
        });

        const interview = await newInterview.save();

        return res.status(201).json({
            message: "Interview Created Successfully",
            interview
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

//user get his  interview
export const getInterview = async (req,res) => {
    try {
        const userId = req.user.id;
        const interviewId = req.params.id;

        const interview = await Interview.findOne({user:userId,_id:interviewId});

        if(!interview){
            return res.status(404).json({message:"Interview Not Found Or Wrong InterviewId"});
        }

        return res.status(200).json({message:"Interview Fetched Successfully",interview});
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

//user get his  interview
export const getAllInterview = async (req,res) => {
    try {
        const userId = req.user.id;

        const interview = await Interview.find({user:userId});

        if(!interview){
            return res.status(404).json({message:"Interview Not Found"});
        }

        return res.status(200).json({message:"Interview Fetched Successfully",interview});
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

//user can start interview
export const startInterview = async (req,res) =>{
    try {
        const userId = req.user.id;
        const interviewId = req.params.id;

        const interview = await Interview.findOne({user:userId,_id:interviewId});

        if(!interview){
            return res.status(404).json({message:"Interview Not Found Or Wrong InterviewId"});
        }

        if(interview.status === "completed"){
            return res.status(404).json({message:"Interview Aleready Completed"});
        }

        interview.status = "in-progress";
        interview.startedAt = new Date();

        await interview.save();

        return res.status(200).json({
            message: "Interview Started Successfully",
            interview
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

//user can end interview
export const endInterview = async (req,res) => {
    try {
        const userId = req.user.id;
        const interviewId = req.params.id;

        const interview = await Interview.findOne({user:userId,_id:interviewId});

        if(!interview){
            return res.status(404).json({message:"Interview Not Found Or Wrong InterviewId"});
        }

        if(interview.status === "completed"){
            return res.status(404).json({message:"Interview Aleready Completed"});
        }

        if(interview.status === "canceled"){
            return res.status(404).json({message:"Interview canceled"});
        }
        if(interview.status !== "in-progress"){
            return res.status(404).json({message:"Interview Not Started Yet"});
        }

        interview.status = "completed";
        interview.completedAt = new Date();


        await interview.save();

        return res.status(200).json({
            message: "Interview Completed Successfully",
            interview
        });

        
    } catch (error) {
          console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
