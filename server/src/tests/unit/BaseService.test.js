import { describe, it, expect, vi, beforeEach } from "vitest";
import BaseService from "../../core/services/BaseService.js";
import { NotFoundError } from "../../core/errors/index.js";

function createMockRepository() {
  return {
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    findBy: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
}

const mockEntity = { _id: "abc", name: "Test Entity" };

describe("BaseService", () => {
  let repo;
  let service;

  beforeEach(() => {
    repo = createMockRepository();
    service = new BaseService(repo, "TestEntity");
  });

  it("create() delegates to repository.create", async () => {
    repo.create.mockResolvedValue(mockEntity);

    const result = await service.create({ name: "Test Entity" });

    expect(repo.create).toHaveBeenCalledWith({ name: "Test Entity" });
    expect(result).toEqual(mockEntity);
  });

  it("getAll() delegates to repository.findAll", async () => {
    repo.findAll.mockResolvedValue([mockEntity]);

    const result = await service.getAll();

    expect(repo.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual([mockEntity]);
  });

  it("getAll() passes filters to repository.findAll", async () => {
    repo.findAll.mockResolvedValue([]);

    await service.getAll({ status: "Active" });

    expect(repo.findAll).toHaveBeenCalledWith({ status: "Active" });
  });

  it("getById() returns entity when found", async () => {
    repo.findById.mockResolvedValue(mockEntity);

    const result = await service.getById("abc");

    expect(repo.findById).toHaveBeenCalledWith("abc");
    expect(result).toEqual(mockEntity);
  });

  it("getById() throws NotFoundError when not found", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.getById("nonexistent")).rejects.toThrow(NotFoundError);
  });

  it("getBy() returns entity when found", async () => {
    repo.findBy.mockResolvedValue(mockEntity);

    const result = await service.getBy("email", "test@test.com");

    expect(repo.findBy).toHaveBeenCalledWith("email", "test@test.com");
    expect(result).toEqual(mockEntity);
  });

  it("getBy() throws NotFoundError when not found", async () => {
    repo.findBy.mockResolvedValue(null);

    await expect(service.getBy("email", "missing@test.com")).rejects.toThrow(
      NotFoundError
    );
  });

  it("update() checks existence then delegates to repository.update", async () => {
    repo.findById.mockResolvedValue(mockEntity);
    repo.update.mockResolvedValue({ ...mockEntity, name: "Updated" });

    const result = await service.update("abc", { name: "Updated" });

    expect(repo.findById).toHaveBeenCalledWith("abc");
    expect(repo.update).toHaveBeenCalledWith("abc", { name: "Updated" });
    expect(result).toEqual({ ...mockEntity, name: "Updated" });
  });

  it("update() throws NotFoundError when entity not found", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.update("nonexistent", {})).rejects.toThrow(
      NotFoundError
    );
  });

  it("delete() checks existence then delegates to repository.delete", async () => {
    repo.findById.mockResolvedValue(mockEntity);
    repo.delete.mockResolvedValue(mockEntity);

    const result = await service.delete("abc");

    expect(repo.findById).toHaveBeenCalledWith("abc");
    expect(repo.delete).toHaveBeenCalledWith("abc");
    expect(result).toEqual(mockEntity);
  });

  it("delete() throws NotFoundError when entity not found", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.delete("nonexistent")).rejects.toThrow(NotFoundError);
  });
});
