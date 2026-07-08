import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
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
    const existingUser = await authRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(rawToken, 10);

    const user = await authRepository.create({
      ...userData,
      emailVerificationToken: hashedToken,
    });

    const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/verify-email?token=${rawToken}&email=${user.email}`;
    console.log(`[DEV] Email verification link: ${verifyUrl}`);

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

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await authRepository.findByIdWithPassword(userId);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      const err = new Error("Current password is incorrect");
      err.statusCode = 401;
      throw err;
    }

    await authRepository.updatePassword(userId, newPassword);
    return { message: "Password updated successfully" };
  }

  async login(email, password) {
    const MAX_ATTEMPTS = 5;
    const LOCK_MINUTES = 15;

    const user = await authRepository.findByEmail(email);

    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const remaining = Math.ceil((user.lockUntil - new Date()) / 60000);
      const err = new Error(`Account locked. Try again in ${remaining} minute${remaining !== 1 ? "s" : ""}`);
      err.statusCode = 423;
      throw err;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      if (attempts >= MAX_ATTEMPTS) {
        await authRepository.lockAccount(user._id, LOCK_MINUTES);
        const err = new Error(`Account locked for ${LOCK_MINUTES} minutes due to too many failed attempts`);
        err.statusCode = 423;
        throw err;
      }
      await authRepository.incrementFailedAttempts(user._id);
      const remaining = MAX_ATTEMPTS - attempts;
      const err = new Error(`Invalid email or password. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining`);
      err.statusCode = 401;
      throw err;
    }

    await authRepository.resetFailedAttempts(user._id);
    await authRepository.updateLastLogin(user._id);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(email) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      return { message: "If that email is registered, a reset link has been sent." };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(rawToken, 10);
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${rawToken}?email=${email}`;
    console.log(`[DEV] Password reset link: ${resetUrl}`);

    return { message: "If that email is registered, a reset link has been sent." };
  }

  async resetPassword(token, email, newPassword) {
    const user = await User.findOne({
      email,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user || !user.passwordResetToken) {
      const err = new Error("Invalid or expired reset token");
      err.statusCode = 400;
      throw err;
    }

    const isValid = await bcrypt.compare(token, user.passwordResetToken);
    if (!isValid) {
      const err = new Error("Invalid or expired reset token");
      err.statusCode = 400;
      throw err;
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return { message: "Password reset successful. You can now log in." };
  }

  async verifyEmail(token, email) {
    const user = await User.findOne({ email });
    if (!user || !user.emailVerificationToken) {
      const err = new Error("Invalid verification token");
      err.statusCode = 400;
      throw err;
    }

    const isValid = await bcrypt.compare(token, user.emailVerificationToken);
    if (!isValid) {
      const err = new Error("Invalid verification token");
      err.statusCode = 400;
      throw err;
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return { message: "Email verified successfully." };
  }
}

export default new AuthService();