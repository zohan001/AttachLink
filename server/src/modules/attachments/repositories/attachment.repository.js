import BaseRepository from "../../../core/repositories/BaseRepository.js";
import Attachment from "../models/attachment.model.js";

const populateFields = [
  { path: "studentId", populate: { path: "userId", select: "firstName lastName email" } },
  { path: "opportunityId", select: "title location category" },
  { path: "companyId", select: "companyName logo" },
  { path: "academicSupervisorId", populate: { path: "userId", select: "firstName lastName email" } },
  { path: "industrialSupervisorId", populate: { path: "userId", select: "firstName lastName email" } },
  { path: "applicationId" },
];

class AttachmentRepository extends BaseRepository {
  constructor() {
    super(Attachment, populateFields);
  }
}

export default new AttachmentRepository();
