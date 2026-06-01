import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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
    },
    password: {
       type : String,
       required: true
    }
},  {timestamps:  true});


//---Midllware hashing the password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.log("Error in hashing:", err);
    throw err; // let Mongoose handle the error
  }
});


//Method to compare entered password with has password

userSchema.methods.matchPassword = async function (enteredPassword){
   return await bcrypt.compare(enteredPassword, this.password);
}


const userModel = mongoose.model ("user", userSchema);



export  default userModel;