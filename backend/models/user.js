import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        firstName:{
            type: String,
            required:true,
            maxlength:50,
        },
        middleName:{
            type: String,
            required: true,
            maxlength: 50,
        },
        lastName:{
            type: String,
            required: true,
            maxlength: 50,
        }
    },
    email:{
        type:String,
        unique:true,
        sparse: true,
        lowercase:true,
        trim:true,
    },
     mobileNo:{
        type:String,
        unique:true,
        sparse: true,
        minlength:10,
        maxlength:13,
        match: /^(\+?[0-9]{1,3})?[0-9]{10}$/,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },
},{timestamps:true});

const User = mongoose.model('User',userSchema);

export default User;