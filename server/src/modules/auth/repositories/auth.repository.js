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
    return await User.findOne({ email }).select("+password");
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
}

export default new AuthRepository();