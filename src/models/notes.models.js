import mongoose from "mongoose";

let noteSchema = new mongoose.Schema({
    title : String,
    description: String
})


const NoteModel = mongoose.model('notes', noteSchema)

export default NoteModel;