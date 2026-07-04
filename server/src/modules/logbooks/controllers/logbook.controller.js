import logbookService from "../services/logbook.service.js";
import responseBuilder from "../../../core/response/responseBuilder.js";

class LogbookController {
  async create(req, res, next) {
    try {
      const logbook = await logbookService.createDraft(req.user.id, req.body);

      return responseBuilder.created(res, logbook, "Logbook entry created successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getMy(req, res, next) {
    try {
      const logbooks = await logbookService.getMy(req.user.id);

      return responseBuilder.success(res, logbooks, "Logbook entries retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getByAttachment(req, res, next) {
    try {
      const logbooks = await logbookService.getByAttachment(req.params.id);

      return responseBuilder.success(res, logbooks, "Logbook entries retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const logbook = await logbookService.getById(req.params.id);

      return responseBuilder.success(res, logbook, "Logbook entry retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const logbook = await logbookService.updateDraft(
        req.params.id,
        req.user.id,
        req.body
      );

      return responseBuilder.success(res, logbook, "Logbook entry updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async submit(req, res, next) {
    try {
      const logbook = await logbookService.submit(req.params.id, req.user.id);

      return responseBuilder.success(res, logbook, "Logbook entry submitted successfully.");
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const logbook = await logbookService.approve(req.params.id, req.user.id);

      return responseBuilder.success(res, logbook, "Logbook entry approved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const logbook = await logbookService.reject(
        req.params.id,
        req.user.id,
        req.body.comment
      );

      return responseBuilder.success(res, logbook, "Logbook entry rejected successfully.");
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await logbookService.delete(req.params.id);

      return responseBuilder.deleted(res, "Logbook entry deleted successfully.");
    } catch (error) {
      next(error);
    }
  }

  async comment(req, res, next) {
    try {
      const logbook = await logbookService.addComment(
        req.params.id,
        req.user.id,
        req.body.comment
      );

      return responseBuilder.success(res, logbook, "Comment added successfully.");
    } catch (error) {
      next(error);
    }
  }
}

export default new LogbookController();
