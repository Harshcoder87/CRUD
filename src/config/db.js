import mongoose  from "mongoose";


async function connectDB(){
    try {
          await mongoose.connect("mongodb://localhost:27017/Kodex")

          console.log("Connected to DB");
    }
    catch(error){
        console.log("Error while conneting mongodb", error);
    }
}

export default connectDB;