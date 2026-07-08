import authService from "../services/auth.service.js";
import companyRepository from "../../companies/repositories/company.repository.js";

class AuthController {
  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  async register(req, res, next) {
    try {
      const { user, accessToken, refreshToken } =
        await authService.register(req.body);

      const company = user.role === "company"
        ? await companyRepository.findByUserId(user._id)
        : null;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        message: "Account created successfully.",
        accessToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          companyId: company?._id || null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.updatePassword(req.user.id, currentPassword, newPassword);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const { user, accessToken, refreshToken } =
        await authService.login(email, password);

      const company = user.role === "company"
        ? await companyRepository.findByUserId(user._id)
        : null;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        accessToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          companyId: company?._id || null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, email, newPassword } = req.body;
      const result = await authService.resetPassword(token, email, newPassword);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token, email } = req.body;
      const result = await authService.verifyEmail(token, email);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();