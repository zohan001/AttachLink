import { describe, it, expect, vi } from "vitest";
import responseBuilder from "../../core/response/responseBuilder.js";

function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe("ResponseBuilder", () => {
  it("created() returns 201 with success and data", () => {
    const res = mockRes();
    const data = { _id: "abc", name: "Test" };

    responseBuilder.created(res, data);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Resource created successfully.",
      data,
    });
  });

  it("created() accepts custom message", () => {
    const res = mockRes();
    responseBuilder.created(res, {}, "Custom created");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Custom created" })
    );
  });

  it("success() returns 200 with success and data", () => {
    const res = mockRes();
    const data = { items: [1, 2, 3] };

    responseBuilder.success(res, data);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Resource retrieved successfully.",
      data,
    });
  });

  it("success() accepts custom message", () => {
    const res = mockRes();
    responseBuilder.success(res, {}, "Custom success");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Custom success" })
    );
  });

  it("deleted() returns 200 with success and no data", () => {
    const res = mockRes();

    responseBuilder.deleted(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Resource deleted successfully.",
    });
  });

  it("deleted() accepts custom message", () => {
    const res = mockRes();
    responseBuilder.deleted(res, "Custom deleted");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Custom deleted" })
    );
  });

  it("paginated() returns 200 with items and pagination", () => {
    const res = mockRes();
    const data = [{ id: 1 }];
    const pagination = { page: 1, limit: 10, total: 1, totalPages: 1 };

    responseBuilder.paginated(res, data, pagination);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Resources retrieved successfully.",
      data: {
        items: data,
        pagination,
      },
    });
  });
});
