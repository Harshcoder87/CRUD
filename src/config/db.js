import mongoose from "mongoose";


async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://Kodex:Kodex%409450@cluster0.iiqdqvs.mongodb.net/CRUD")
        console.log("Connected to DB");
    }
    catch (error) {
        console.log("Error while conneting mongodb", error);
    }
}

export default connectDB;