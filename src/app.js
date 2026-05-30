
import express from 'express';
import connectDB from './config/db.js';
import NoteModel from './models/notes.models.js'
import mongoose from 'mongoose';
import userModel from './models/user.models.js';
import cookieParser from "cookie-parser";



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
  const { email, name } = req.body;

  // --- validation ---------
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  // Validate email with regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // --- simple cookie creation (no JWT) -----------
  const token = JSON.stringify({ name, email });

  res.cookie("token", token, {
    httpOnly: true,   // prevents client-side JS access
    secure: false,    // set true if using HTTPS
    sameSite: "strict",
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  return res.status(201).json({
    message: "User registered successfully",
    user: { name, email }
  });



});









/**
 * @route POST api/notes
 * @description create a note need title and description in req body
 * @access Pub
 */

app.post('/api/notes', async (req, res) => {

   const { title, description } = req.body;

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


   const newNote = await NoteModel.create({ title, description });

   return res.status(201).json({
      message: "New note created",
      note: newNote
   }
   );
})

/**
 * @route POST api/notes
 * @description read a note need title and description in req body
 * @access Public access
 */

app.get('/api/notes', async (req, res) => {

   const notes = await NoteModel.find();


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