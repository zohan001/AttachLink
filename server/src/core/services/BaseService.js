import { NotFoundError } from "../errors/index.js";

class BaseService {
  constructor(repository, entityName) {
    this.repository = repository;
    this.entityName = entityName;
  }

  async create(data) {
    return await this.repository.create(data);
  }

  async getAll(filters = {}) {
    return await this.repository.findAll(filters);
  }

  async getById(id) {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundError(`${this.entityName} not found`);
    }
    return entity;
  }

  async getBy(field, value) {
    const entity = await this.repository.findBy(field, value);
    if (!entity) {
      throw new NotFoundError(`${this.entityName} not found`);
    }
    return entity;
  }

  async update(id, data) {
    await this.getById(id);
    return await this.repository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    return await this.repository.delete(id);
  }
}

export default BaseService;
