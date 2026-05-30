
import app from "./src/app.js"
import connectDB from "./src/config/db.js";






await connectDB();

app.listen(3000, () =>{
    console.log("Server is running at port 3000");
})


















//for now server start aim and connecting with db