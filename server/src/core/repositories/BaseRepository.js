import { AppError } from "../errors/index.js";

class BaseRepository {
  constructor(model, populateFields = []) {
    this.model = model;
    this.populateFields = populateFields;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id) {
    let query = this.model.findById(id);
    if (this.populateFields.length) {
      this.populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }
    return await query;
  }

  async findAll(filters = {}) {
    let query = this.model.find(filters);
    if (this.populateFields.length) {
      this.populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }
    return await query;
  }

  async update(id, data) {
    let query = this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (this.populateFields.length) {
      this.populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }
    return await query;
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async findBy(field, value) {
    let query = this.model.findOne({ [field]: value });
    if (this.populateFields.length) {
      this.populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }
    return await query;
  }

  async findAllBy(field, value) {
    let query = this.model.find({ [field]: value });
    if (this.populateFields.length) {
      this.populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }
    return await query;
  }

  async exists(field, value, excludeId = null) {
    const filter = { [field]: value };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    return await this.model.exists(filter);
  }
}

export default BaseRepository;
