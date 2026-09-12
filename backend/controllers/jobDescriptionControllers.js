import JD from "../models/jobDescription.js";

//create JD 
export const createJD = async (req,res) => {
    try {
        //user id from jwtAuth
        const userId = req.user.id;

        const {title,company,content} = req.body;


        const newJD = new JD({
            user:userId,
            title:title,
            company:company,
            content:content
        });

        const response = await newJD.save();

        return res.status(201).json({
            message:"JD Created Successfully",
            response:response
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

// User can get their JDs
export const getAllJD = async (req, res) => {
    try {
        const userId = req.user.id;

        const jds = await JD.find({ user: userId });

        if (jds.length === 0) {
            return res.status(404).json({
                message: "No JDs Found For This User"
            });
        }

        return res.status(200).json({
            message: "JDs Fetched Successfully",
            jds
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// User can get their JDs
export const getJD = async (req, res) => {
    try {
        const userId = req.user.id;
        const jdId = req.params.id;

        const jd = await JD.findOne({ user: userId,_id:jdId});

        if (!jd) {
            return res.status(404).json({
                message: "This JD Is Not Available Or Wrong JD Id"
            });
        }

        return res.status(200).json({
            message: "JD Fetched Successfully",
            jd
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

//deleted jd successfully
export const deleteJD = async (req,res) => {
    try {
        const userId = req.user.id;
        const jdId = req.params.id;

        const jd = await JD.findByIdAndDelete({user:userId,_id:jdId});
         
        return res.status(200).json({
            message: "JD Deleted Successfully",
            jd
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const updateJD = async (req,res) => {
    try {
        const userId = req.user.id;
        const jdId = req.params.id;
        const data = req.body;

        const jd = await JD.findOneAndUpdate({user:userId,_id:jdId},data,{
            new:true
        });
        
        return res.status(200).json({
            message: "JD Updated Successfully",
            jd
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}