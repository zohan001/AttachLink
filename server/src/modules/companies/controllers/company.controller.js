import companyService from "../services/company.service.js";

class CompanyController {
  async create(req, res, next) {
    try {
      const company = await companyService.createProfile(
        req.user.id,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: "Company profile created successfully.",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const companies = await companyService.getAll();

      return res.status(200).json({
        success: true,
        message: "Companies retrieved successfully.",
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const company = await companyService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Company retrieved successfully.",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const company = await companyService.getByUserId(req.user.id);

      return res.status(200).json({
        success: true,
        message: "Company profile retrieved successfully.",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const company = await companyService.updateProfile(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: "Company profile updated successfully.",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await companyService.deleteProfile(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Company profile deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CompanyController();
