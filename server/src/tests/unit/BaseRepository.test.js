import { describe, it, expect, vi, beforeEach } from "vitest";
import BaseRepository from "../../core/repositories/BaseRepository.js";

const mockDoc = { _id: "abc", name: "Test", __v: 0 };
const mockDocUpdated = { _id: "abc", name: "Updated", __v: 0 };
const mockDocs = [mockDoc];

function queryChain(resolvedValue) {
  const chain = {
    populate: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
  };
  const resultPromise = Promise.resolve(resolvedValue);
  Object.assign(chain, {
    then: resultPromise.then.bind(resultPromise),
    catch: resultPromise.catch.bind(resultPromise),
    finally: resultPromise.finally.bind(resultPromise),
  });
  return chain;
}

function createMockModel() {
  const model = vi.fn();

  model.create = vi.fn().mockResolvedValue(mockDoc);
  model.findById = vi.fn().mockReturnValue(queryChain(mockDoc));
  model.find = vi.fn().mockReturnValue(queryChain(mockDocs));
  model.findByIdAndUpdate = vi.fn().mockReturnValue(queryChain(mockDocUpdated));
  model.findByIdAndDelete = vi.fn().mockResolvedValue(mockDoc);
  model.findOne = vi.fn().mockReturnValue(queryChain(mockDoc));
  model.exists = vi.fn().mockResolvedValue(true);

  return model;
}

describe("BaseRepository", () => {
  let repo;
  let model;

  beforeEach(() => {
    model = createMockModel();
    repo = new BaseRepository(model, ["populatedField"]);
  });

  it("create() calls model.create with data", async () => {
    const result = await repo.create({ name: "Test" });
    expect(model.create).toHaveBeenCalledWith({ name: "Test" });
    expect(result).toEqual(mockDoc);
  });

  it("findById() calls model.findById with id", async () => {
    const result = await repo.findById("abc");
    expect(model.findById).toHaveBeenCalledWith("abc");
    expect(result).toEqual(mockDoc);
  });

  it("findById() calls populate when populateFields is set", async () => {
    model.findById.mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockDoc),
    });
    const result = await repo.findById("abc");
    expect(model.findById).toHaveBeenCalled();
    expect(result).toEqual(mockDoc);
  });

  it("findAll() calls model.find with filters", async () => {
    const result = await repo.findAll({ status: "Active" });
    expect(model.find).toHaveBeenCalledWith({ status: "Active" });
    expect(result).toEqual(mockDocs);
  });

  it("update() calls findByIdAndUpdate with id and data", async () => {
    const result = await repo.update("abc", { name: "Updated" });
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      "abc",
      { name: "Updated" },
      { new: true, runValidators: true }
    );
    expect(result).toEqual(mockDocUpdated);
  });

  it("delete() calls findByIdAndDelete with id", async () => {
    const result = await repo.delete("abc");
    expect(model.findByIdAndDelete).toHaveBeenCalledWith("abc");
    expect(result).toEqual(mockDoc);
  });

  it("findBy() calls findOne with field/value pair", async () => {
    const result = await repo.findBy("email", "test@test.com");
    expect(model.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(result).toEqual(mockDoc);
  });

  it("findAllBy() calls find with field/value pair", async () => {
    const result = await repo.findAllBy("companyId", "comp123");
    expect(model.find).toHaveBeenCalledWith({ companyId: "comp123" });
    expect(result).toEqual(mockDocs);
  });

  it("exists() calls model.exists with filter", async () => {
    const result = await repo.exists("email", "test@test.com");
    expect(model.exists).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(result).toBe(true);
  });

  it("exists() excludes id when excludeId is provided", async () => {
    await repo.exists("email", "test@test.com", "otherId");
    expect(model.exists).toHaveBeenCalledWith({
      email: "test@test.com",
      _id: { $ne: "otherId" },
    });
  });

  it("findById() returns null when not found", async () => {
    model.findById.mockReturnValue(queryChain(null));
    const result = await repo.findById("nonexistent");
    expect(result).toBeNull();
  });

  it("findAll() with no populateFields skips populate", async () => {
    const simpleRepo = new BaseRepository(model);
    const mockQuery = vi.fn().mockResolvedValue(mockDocs);
    model.find.mockReturnValue(mockQuery());

    const result = await simpleRepo.findAll();
    expect(result).toEqual(mockDocs);
  });
});
