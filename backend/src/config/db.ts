import mongoose from "mongoose";
require("dotenv").config();
const dbURL: string = process.env.DB_URL || "";

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL).then((data: any) => {
      console.log(`Connected to the database ${data.connection.host}`);
    });
  } catch (error : any) {
    console.error(`Failed to connect to the database ${error.message} `);
    
    setTimeout(connectDB,5000)
  }
};

export default connectDB;