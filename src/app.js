
import express from 'express';
import connectDB from './config/db.js';
import NoteModel from './models/notes.models.js'
import mongoose from 'mongoose';
import userModel from './models/user.models.js';
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();


const app = express();

//Middleware of cookies parser
app.use(express.json());
app.use(cookieParser());



/**
 * * @route POST api/notes/register
 *   @description register the user and creating a new toke
 *   @access Public access
 */
app.post("/api/auth/register", async (req, res) => {
   const { email, name, password } = req.body;


   // --- validation ---------
   if (!email) {
      return res.status(400).json({ error: "Email is required" });
   }
   if (!name) {
      return res.status(400).json({ error: "Name is required" });
   }

   //----- password and it's lenght check
   if (!password || password.trim().length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
   }

   // Validate email with regex
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
   }

   //----If validation passes, create the user----

   const newUser = await userModel.create({ name, email, password });

   // --- simple cookie creation (no JWT) -----------
   const token = jwt.sign({ name, email },
      process.env.JWT_SECRET
   );
console.log("JWT_SECRET at startup:", process.env.JWT_SECRET);


   res.cookie("token", token, {
      httpOnly: true,   // prevents client-side JS access
      secure: false,    // set true if using HTTPS
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 // 1 hour
   });

   return res.status(201).json({
      message: "User registered successfully",
      user: newUser
   });

});

app.post('api/auth/login', async(req, res)  =>{
      const { email, password } = req.body;

       // ---- Validation ----
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.trim().length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
 
      // ---- If validation passes, check if the user exists ----
  
      //Checking the email is valid
      const user = await userModel.findOne({ email });

      if(!user){
         return res.status(404).json({error: "Invalid credentials"});
      }

     if(!(user.matchPassword(password))){
      return res.status(401).json({error:"Invalid credentials" });
     }

   const token = jwt.sign(
      {id: user._id, email : user.email},
      process.env.JWT_SECRET);
      console.log(token);
   
      res.cookie("token", token)

       return res.status(200).json({
         message : "User Logged in sucessfully",
         user
       }
   )
})


/**
 * @route POST api/notes
 * @description create a note need title and description in req body
 * @access Pub
 */

app.post('/api/notes', async (req, res) => {

   const { title, description } = req.body;
   const token = req.cookies.token;
   const user = jwt.verify(token, process.env.JWT_SECRET);
   req.user = user; //saving the user data coming in req.user


   //=========validation==========

   if (!title) {
      return res.status(400).json({ error: "Title is required" });
   }
   if (!description) {
      return res.status(400).json({ error: "Description is required" });
   }

   if (title.trim().length < 4) {
      return res.status(400).json({ error: "The title length need atleast 4 character" });
   }
   //------validation is done then create --------


   //--- if validation passes, create the new note -----

   const newNote = await NoteModel.create({
      title,
      description,
      user: req.user.email  //sending user mail id alos
   })

   return res.status(201).json({
      message: "New note created",
      note: newNote,
   });
})

/**
 * @route POST api/notes
 * @description read a note need title and description in req body
 * @access Public access
 */

app.get('/api/notes', async (req, res) => {


   req.user = user; // { id: "user_id", email: "user_email" }


   const notes = await NoteModel.find({
      user: req.user.email  //making query find with email who is logged now
   });


   res.status(200).json({
      message: " Notes Create sucessfully",
      notes
   });

})

/**
 * @route Patch api/notes
 * @description Update a note description by id and require re
 * @access Public access
 */

app.patch('/api/notes/:id', async (req, res) => {
   const { id } = req.params;
   const { description } = req.body;


   //----------vlaidation ----------
   if (!description) {
      return res.status(400).json({ error: "Description is required" });
   }
   if (description.trim().length < 4) {

      return res.status(400).json({ error: "The description length need atleast 4 character" });
   }

   const note = await NoteModel.findById(id); //finding the note

   if (!note) {
      return res.status(404).json({ error: "Note not found" });
   }
   note.description = description; //updating the desc
   await note.save(); //

   return res.status(200).json({
      messsage: "Notes saved successfully",
      note
   });
})


/**
 * @route DELTE api/notes
 * @description Delete a note description by id and require re
 * @access Public access
 */

app.delete('/api/notes/:id', async (req, res) => {

   const { id } = req.params;
   const { description } = req.body;

   //--- check if notes id  exists------

   if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404)
         .json({ success: false, message: "Invalid ID not found" });
   }
   const note = await NoteModel.findById(id);

   if (!note) {
      return res.status(404).json({ error: "Note not found" });
   }


   //------Deleting the note ------------ 
   await note.delete();

   return res.status(200).json({
      message: "Note deleted successfully"
   });

})



export default app;









// server instance creation and config krna

//for server config and creationlike - logger, morgan, middleware, rate limiting