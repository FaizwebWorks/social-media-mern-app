import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGOURL}snapify`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error while connecting to db:", error);
  }
};

export default connectDb;