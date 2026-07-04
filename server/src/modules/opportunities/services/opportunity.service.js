import opportunityRepository from "../repositories/opportunity.repository.js";
import companyRepository from "../../companies/repositories/company.repository.js";

class OpportunityService {
  async create(userId, data) {
    const company = await companyRepository.findByUserId(userId);

    if (!company) {
      throw new Error("Company profile not found. Create a company profile first.");
    }

    if (new Date(data.applicationDeadline) <= new Date()) {
      throw new Error("Application deadline cannot be in the past");
    }

    const opportunity = await opportunityRepository.create({
      ...data,
      companyId: company._id,
    });

    return opportunity;
  }

  async getAll(filters = {}) {
    const query = { ...filters };

    if (!query.status && !filters.includeDraft) {
      query.status = { $in: ["Open", "Closed"] };
    }

    return await opportunityRepository.findAll(query);
  }

  async getById(id) {
    const opportunity = await opportunityRepository.findById(id);

    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    return opportunity;
  }

  async getMyOpportunities(userId) {
    const company = await companyRepository.findByUserId(userId);

    if (!company) {
      throw new Error("Company profile not found");
    }

    return await opportunityRepository.findByCompany(company._id);
  }

  async update(id, data, requestingUserId, requestingUserRole) {
    const opportunity = await opportunityRepository.findById(id);

    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    const company = await companyRepository.findByUserId(requestingUserId);

    const isOwner =
      company &&
      opportunity.companyId._id.toString() === company._id.toString();

    if (requestingUserRole !== "admin" && !isOwner) {
      throw new Error("You can only update your own opportunities");
    }

    if (data.applicationDeadline && new Date(data.applicationDeadline) <= new Date()) {
      throw new Error("Application deadline cannot be in the past");
    }

    const updated = await opportunityRepository.update(id, data);

    return updated;
  }

  async delete(id, requestingUserId, requestingUserRole) {
    const opportunity = await opportunityRepository.findById(id);

    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    if (requestingUserRole !== "admin") {
      throw new Error("Only admins can delete opportunities");
    }

    await opportunityRepository.delete(id);

    return { id };
  }

  async publish(id, requestingUserId, requestingUserRole) {
    const opportunity = await opportunityRepository.findById(id);

    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    const company = await companyRepository.findByUserId(requestingUserId);

    const isOwner =
      company &&
      opportunity.companyId._id.toString() === company._id.toString();

    if (requestingUserRole !== "admin" && !isOwner) {
      throw new Error("You can only publish your own opportunities");
    }

    if (opportunity.published) {
      throw new Error("Opportunity is already published");
    }

    if (new Date(opportunity.applicationDeadline) <= new Date()) {
      throw new Error("Cannot publish an opportunity with a past deadline");
    }

    const updated = await opportunityRepository.update(id, {
      published: true,
      status: "Open",
    });

    return updated;
  }

  async close(id, requestingUserId, requestingUserRole) {
    const opportunity = await opportunityRepository.findById(id);

    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    const company = await companyRepository.findByUserId(requestingUserId);

    const isOwner =
      company &&
      opportunity.companyId._id.toString() === company._id.toString();

    if (requestingUserRole !== "admin" && !isOwner) {
      throw new Error("You can only close your own opportunities");
    }

    if (opportunity.status === "Closed") {
      throw new Error("Opportunity is already closed");
    }

    const updated = await opportunityRepository.update(id, {
      status: "Closed",
    });

    return updated;
  }
}

export default new OpportunityService();
