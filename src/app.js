
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



export default app;









// server instance creation and config krna

//for server config and creationlike - logger, morgan, middleware, rate limiting