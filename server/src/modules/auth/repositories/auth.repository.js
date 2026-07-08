import User from "../models/user.model.js";

class AuthRepository {
  /*
  |--------------------------------------------------------------------------
  | Create User
  |--------------------------------------------------------------------------
  */

  async create(userData) {
    return await User.create(userData);
  }

  /*
  |--------------------------------------------------------------------------
  | Find User By Email
  |--------------------------------------------------------------------------
  */

  async findByEmail(email) {
    return await User.findOne({ email }).select("+password +failedLoginAttempts +lockUntil");
  }

  /*
  |--------------------------------------------------------------------------
  | Find User By ID
  |--------------------------------------------------------------------------
  */

  async findById(id) {
    return await User.findById(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Last Login
  |--------------------------------------------------------------------------
  */

  async updateLastLogin(id) {
    return await User.findByIdAndUpdate(
      id,
      {
        lastLogin: new Date(),
      },
      {
        returnDocument: "after",
      }
    );
  }

  async findByIdWithPassword(id) {
    return await User.findById(id).select("+password");
  }

  async updatePassword(id, newPassword) {
    const user = await User.findById(id);
    if (!user) return null;
    user.password = newPassword;
    return await user.save();
  }

  async incrementFailedAttempts(id) {
    return await User.findByIdAndUpdate(id, { $inc: { failedLoginAttempts: 1 } });
  }

  async resetFailedAttempts(id) {
    return await User.findByIdAndUpdate(id, { failedLoginAttempts: 0, lockUntil: null });
  }

  async lockAccount(id, minutes) {
    const lockUntil = new Date(Date.now() + minutes * 60 * 1000);
    return await User.findByIdAndUpdate(id, { failedLoginAttempts: 0, lockUntil });
  }
}

export default new AuthRepository();