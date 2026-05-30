import mongoose from "mongoose";


let userSchema = new mongoose.Schema({
    name :{
       type : String,
       required: true,
       trim: true
    },
    email: {
         type : String,
       required: true,
       unique : true, //whole db email is unique
       trim: true,
       lowercase: true,
    }
},  {timestamps:  true});


const userModel = mongoose.model ("user", userSchema);


export  default userModel;