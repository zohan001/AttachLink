import attachmentService from "../services/attachment.service.js";
import responseBuilder from "../../../core/response/responseBuilder.js";

class AttachmentController {
  async create(req, res, next) {
    try {
      const attachment = await attachmentService.createFromAcceptedApplication(
        req.user.id,
        req.body
      );

      return responseBuilder.created(res, attachment, "Attachment created successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const attachments = await attachmentService.getAll();

      return responseBuilder.success(res, attachments, "Attachments retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const attachment = await attachmentService.getById(req.params.id);

      return responseBuilder.success(res, attachment, "Attachment retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getMy(req, res, next) {
    try {
      const attachments = await attachmentService.getByStudent(req.user.id);

      return responseBuilder.success(res, attachments, "Your attachments retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const attachment = await attachmentService.update(
        req.params.id,
        req.body
      );

      return responseBuilder.success(res, attachment, "Attachment updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await attachmentService.delete(req.params.id);

      return responseBuilder.deleted(res, "Attachment deleted successfully.");
    } catch (error) {
      next(error);
    }
  }

  async complete(req, res, next) {
    try {
      const attachment = await attachmentService.complete(req.params.id);

      return responseBuilder.success(res, attachment, "Attachment completed successfully.");
    } catch (error) {
      next(error);
    }
  }

  async terminate(req, res, next) {
    try {
      const attachment = await attachmentService.terminate(
        req.params.id,
        req.body.reason
      );

      return responseBuilder.success(res, attachment, "Attachment terminated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async assignSupervisor(req, res, next) {
    try {
      const { supervisorField } = req.params;
      const attachment = await attachmentService.assignSupervisor(
        req.params.id,
        supervisorField,
        req.body.supervisorId,
        req.user.role
      );

      return responseBuilder.success(res, attachment, "Supervisor assigned successfully.");
    } catch (error) {
      next(error);
    }
  }
}

export default new AttachmentController();
