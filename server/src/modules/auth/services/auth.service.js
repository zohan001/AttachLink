import authRepository from "../repositories/auth.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.js";

class AuthService {
  /*
  |--------------------------------------------------------------------------
  | Register User
  |--------------------------------------------------------------------------
  */

  async register(userData) {
    // Check if email already exists
    const existingUser = await authRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Create user
    const user = await authRepository.create(userData);

    // Generate tokens
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Login User
  |--------------------------------------------------------------------------
  */

  async login(email, password) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    await authRepository.updateLastLogin(user._id);

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();