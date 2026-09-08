import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import mongoose from "mongoose";


//signup controller
export const signup = async (req,res) => {
        try {
            const data = req.body;

            const existingUser = await User.findOne({email:data.email});

            if(existingUser){
                return res.status(401).json({message:"User already exist:"});
            }

            data.password = await bcryptjs.hash(data.password,10);
             
            const newUser = new User(data);

            const response = await newUser.save();


            const token = jwt.sign(
                {
                    id:response._id,
                    role: response.role
                },
                process.env.JWT_SECRET,
                {
                   expiresIn: "1h"
                }
            );

            return res.status(201).json({message:"User registered successfully:",response:response,
            token:token});
            


        } catch (error) {
            console.log(error);
            return res.status(500).json({message:"Internal Server Error:"});
        }
}

//login controller
export const login = async (req,res) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email:email});

        if(!user){
            return res.status(404).json({message:"User Not Found:"});
        }

         const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid Password"});
        }

        const token = jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1h"
            }
        );

        res.status(200).json({message:"Login Successfully:",token:token});

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error:"});
    }
}

//get user profile
export const profile = async (req,res) => {
    try {
        const userData = req.user;
        const userId = userData.id;

        const user = await User.findById(userId);
        if(!user){
            return res.status(500).json({message:"User Not Found:"});
        }

        return res.status(200).json({message:"Get User Profile:",user:user});
    } catch (error) {
         console.log(error);
        res.status(500).json({message:"Internal Server Error:"});
    }
}

//user change his profile data
export const updateProfile = async (req,res) =>{
   try {
          const userData = req.user;
          const userId = userData.id;
          const user = await User.findById(userId);
          if(!user){
             return res.status(404).json({message:"user not found or not exist"});
          }
          const data = req.body;
            
           

          // update user data
          const response = await User.findByIdAndUpdate(userId,data,{
              new:true,//data updated
              
          });
          res.status(200).json({response:response});

   } catch (error) {
    console.log(error);
         res.status(500).json({message:"Internal server error"});
   }
}

//password change
//user change his password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    // check required
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords are required",
      });
    }

    // find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // compare current password
    const isMatch = await bcryptjs.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid current password",
      });
    }//this is

    // hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Password not updated",
    });
  }
};