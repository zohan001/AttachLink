import evaluationService from "../services/evaluation.service.js";
import responseBuilder from "../../../core/response/responseBuilder.js";

class EvaluationController {
  async create(req, res, next) {
    try {
      const evaluation = await evaluationService.create(req.user.id, req.body);

      return responseBuilder.created(res, evaluation, "Evaluation created successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getMy(req, res, next) {
    try {
      const evaluations = await evaluationService.getMy(req.user.id, req.user.role);

      return responseBuilder.success(res, evaluations, "Evaluations retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getByAttachment(req, res, next) {
    try {
      const evaluations = await evaluationService.getByAttachment(req.params.id);

      return responseBuilder.success(res, evaluations, "Evaluations retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const evaluation = await evaluationService.getById(req.params.id);

      return responseBuilder.success(res, evaluation, "Evaluation retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const evaluation = await evaluationService.updateDraft(
        req.params.id,
        req.user.id,
        req.body
      );

      return responseBuilder.success(res, evaluation, "Evaluation updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async submit(req, res, next) {
    try {
      const evaluation = await evaluationService.submit(req.params.id, req.user.id);

      return responseBuilder.success(res, evaluation, "Evaluation submitted successfully.");
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await evaluationService.delete(req.params.id);

      return responseBuilder.deleted(res, "Evaluation deleted successfully.");
    } catch (error) {
      next(error);
    }
  }
}

export default new EvaluationController();
