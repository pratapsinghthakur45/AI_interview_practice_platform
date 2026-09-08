import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const jwtAuth = async (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status({message:"Token is missing:"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid Or Missing:"});
    }
}

export default jwtAuth;