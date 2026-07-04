import authService from "../services/auth.service.js";

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

      // Store Refresh Token in HTTP Only Cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
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
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();