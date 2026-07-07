import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import User from "./src/modules/auth/models/user.model.js";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: "admin@attachlink.com" });
  if (existing) {
    console.log("Admin already exists.");
    process.exit(0);
  }

  await User.create({
    firstName: "Super",
    lastName: "Admin",
    email: "admin@attachlink.com",
    password: "Admin@123",
    role: "admin",
  });

  console.log("Admin created:");
  console.log("  Email: admin@attachlink.com");
  console.log("  Password: Admin@123");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
