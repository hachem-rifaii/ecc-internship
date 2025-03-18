import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./src/config/db";



connectDB();
// listen on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
