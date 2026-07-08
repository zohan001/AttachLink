import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDatabase from "./config/database.js";
import { registerEventListeners } from "./core/events/registerListeners.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    registerEventListeners();

    app.listen(PORT, () => {
      logger.info(`AttachLink API running — Env: ${process.env.NODE_ENV}, Port: ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error.message);
  }
};

startServer();