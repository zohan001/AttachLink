import BaseRepository from "../../../core/repositories/BaseRepository.js";
import Evaluation from "../models/evaluation.model.js";

const populateFields = [
  {
    path: "attachmentId",
    populate: [
      { path: "opportunityId", select: "title" },
      { path: "companyId", select: "companyName" },
    ],
  },
  {
    path: "studentId",
    populate: { path: "userId", select: "firstName lastName email" },
  },
  {
    path: "evaluatorId",
    populate: { path: "userId", select: "firstName lastName email" },
  },
];

class EvaluationRepository extends BaseRepository {
  constructor() {
    super(Evaluation, populateFields);
  }
}

export default new EvaluationRepository();
