import Opportunity from "../models/opportunity.model.js";

class OpportunityRepository {
  async create(data) {
    return await Opportunity.create(data);
  }

  async findById(id) {
    return await Opportunity.findById(id).populate(
      "companyId",
      "companyName logo city industry"
    );
  }

  async findByCompany(companyId) {
    return await Opportunity.find({ companyId })
      .populate("companyId", "companyName logo city industry")
      .sort({ createdAt: -1 });
  }

  async findAll(filters = {}) {
    const {
      search,
      location,
      category,
      workMode,
      status,
      sort = "-createdAt",
      page = 1,
      limit = 10,
    } = filters;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "skills": { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const sortOption = {};
    if (sort === "newest") sortOption.createdAt = -1;
    else if (sort === "oldest") sortOption.createdAt = 1;
    else if (sort === "deadline") sortOption.applicationDeadline = 1;
    else if (sort === "-createdAt") sortOption.createdAt = -1;
    else sortOption.createdAt = -1;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(query)
        .populate("companyId", "companyName logo city industry")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Opportunity.countDocuments(query),
    ]);

    return {
      opportunities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async update(id, data) {
    return await Opportunity.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    }).populate("companyId", "companyName logo city industry");
  }

  async delete(id) {
    return await Opportunity.findByIdAndDelete(id);
  }

  async countByCompany(companyId) {
    return await Opportunity.countDocuments({ companyId });
  }
}

export default new OpportunityRepository();
