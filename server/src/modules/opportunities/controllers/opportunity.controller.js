import opportunityService from "../services/opportunity.service.js";

class OpportunityController {
  async create(req, res, next) {
    try {
      const opportunity = await opportunityService.create(
        req.user.id,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: "Opportunity created successfully.",
        data: opportunity,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await opportunityService.getAll(req.query);

      return res.status(200).json({
        success: true,
        message: "Opportunities retrieved successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const opportunity = await opportunityService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Opportunity retrieved successfully.",
        data: opportunity,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMy(req, res, next) {
    try {
      const opportunities = await opportunityService.getMyOpportunities(
        req.user.id
      );

      return res.status(200).json({
        success: true,
        message: "Your opportunities retrieved successfully.",
        data: opportunities,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const opportunity = await opportunityService.update(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: "Opportunity updated successfully.",
        data: opportunity,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await opportunityService.delete(
        req.params.id,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: "Opportunity deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async publish(req, res, next) {
    try {
      const opportunity = await opportunityService.publish(
        req.params.id,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: "Opportunity published successfully.",
        data: opportunity,
      });
    } catch (error) {
      next(error);
    }
  }

  async close(req, res, next) {
    try {
      const opportunity = await opportunityService.close(
        req.params.id,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: "Opportunity closed successfully.",
        data: opportunity,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OpportunityController();
