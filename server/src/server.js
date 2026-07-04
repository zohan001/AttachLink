import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDatabase from "./config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`
================================================
🚀 AttachLink API is running
🌐 Environment : ${process.env.NODE_ENV}
📡 Server      : http://localhost:${PORT}
================================================
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();