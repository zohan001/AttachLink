import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected — DB: ${connection.connection.name}, Host: ${connection.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDatabase;