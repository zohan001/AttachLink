import BaseRepository from "../../../core/repositories/BaseRepository.js";
import Logbook from "../models/logbook.model.js";

const populateFields = [
  {
    path: "attachmentId",
    populate: [
      { path: "opportunityId", select: "title companyId" },
      { path: "companyId", select: "companyName" },
    ],
  },
  {
    path: "studentId",
    populate: { path: "userId", select: "firstName lastName email" },
  },
];

class LogbookRepository extends BaseRepository {
  constructor() {
    super(Logbook, populateFields);
  }
}

export default new LogbookRepository();
