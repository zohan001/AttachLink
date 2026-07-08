import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

const appSchema = new mongoose.Schema({}, { strict: false, collection: "applications" });
const attSchema = new mongoose.Schema({}, { strict: false, collection: "attachments" });

const Application = mongoose.model("ApplicationBackfill", appSchema);
const Attachment = mongoose.model("AttachmentBackfill", attSchema);

async function run() {
  await mongoose.connect(uri);
  console.log("Connected");

  const accepted = await Application.find({ status: "Accepted" }).lean();

  let count = 0;
  for (const app of accepted) {
    const existing = await Attachment.findOne({ applicationId: app._id });
    if (!existing) {
      await Attachment.create({
        applicationId: app._id,
        studentId: app.studentId?._id || app.studentId,
        opportunityId: app.opportunityId?._id || app.opportunityId,
        companyId: app.companyId?._id || app.companyId,
        status: "Active",
      });
      count++;
    }
  }

  console.log(`Created ${count} attachments for accepted applications`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
