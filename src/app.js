
import express from 'express';
import connectDB from './config/db.js';
import NoteModel from './models/notes.models.js'

const app = express();
app.use(express.json()); // middleware to read input coming from clinet in json fomat

/**
 * @route POST api/notes
 * @description create a note need title and description in req body
 * @access Pub
 */



app.post('/api/notes', async(req, res) =>{
    
 const {title, description} = req.body;

//=========validation==========

 if(!title){
    return res.status(400).json({error: "Title is required"});
 }
 if(!description){
    return res.status(400).json({error: "Description is required"});
 }

if (title.trim().length<4){
   return res.status(400).json({error: "The title length need atleast 4 character"});
}
 //------validation is done then create --------


 const newNote  = await NoteModel.create({title,description});
 
 return res.status(201).json( {
         message : "New note created",
         note: newNote
    }
  );
})

/**
 * @route POST api/notes
 * @description read a note need title and description in req body
 * @access Public access
 */

app.get('/api/notes', async( req, res)  =>{

   const notes = await NoteModel.find();


    res.status(200).json({
        message : " Notes Create sucessfully",
        notes
    });

})

/**
 * @route POST api/notes
 * @description Update a note description by id and require re
 * @access Public access
 */

app.patch('/api/notes/:id',async(req, res) =>{
     const {id} = req.params;
     const {description} = req.body;


     //----------vlaidation ----------
   if(!description){
    return res.status(400).json({error: "Description is required"});
 }
  if (description.trim().length<4){

   return res.status(400).json({error: "The description length need atleast 4 character"});
}

  const note = await NoteModel.findById(id); //finding the note

   if(!note){
     return res.status(404).json({error: "Note not found"});
   }
   note.description = description; //updating the desc
   await note.save(); //

    return res.status(200).json({
        messsage: "Notes saved successfully",
        note
    });
})
 

export default app;









// server instance creation and config krna

//for server config and creationlike - logger, morgan, middleware, rate limiting