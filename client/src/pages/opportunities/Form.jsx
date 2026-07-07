import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import { getOpportunity, createOpportunity, updateOpportunity } from "../../api/opportunities";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  internshipType: z.enum(["Industrial Attachment", "Internship", "Graduate Trainee", "Apprenticeship"], {
    errorMap: () => ({ message: "Internship type is required" }),
  }),
  location: z.string().min(1, "Location is required"),
  workMode: z.enum(["On-site", "Hybrid", "Remote"], { errorMap: () => ({ message: "Work mode is required" }) }),
  vacancies: z.coerce.number().int().min(1, "At least 1 vacancy required"),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
  duration: z.string().min(1, "Duration is required"),
  requirements: z.string().min(1, "At least one requirement is required"),
  salary: z.string().optional(),
});

export default function OpportunityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = !!id;

  const { data: opp, isLoading } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: () => getOpportunity(id),
    enabled: isEdit,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    values: opp ? {
      title: opp.title || "",
      description: opp.description || "",
      category: opp.category || "",
      internshipType: opp.internshipType || "",
      location: opp.location || "",
      workMode: opp.workMode || "",
      vacancies: opp.vacancies || 1,
      applicationDeadline: opp.applicationDeadline ? opp.applicationDeadline.slice(0, 10) : "",
      duration: opp.duration || "",
      requirements: Array.isArray(opp.requirements) ? opp.requirements.join("\n") : (opp.requirements || ""),
      salary: opp.salary || "",
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit ? updateOpportunity(id, data) : createOpportunity(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["opportunities"] });
      toast.success(isEdit ? "Updated" : "Created");
      navigate(isEdit ? `/opportunities/${id}` : `/opportunities/${res._id}`);
    },
    onError: (err) => handleApiError(err),
  });

  if (isEdit && isLoading) return <Loading />;

  return (
    <div className="max-w-2xl">
      <PageHeader title={isEdit ? "Edit Opportunity" : "Post Opportunity"} />
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate({
          ...d,
          requirements: d.requirements.split("\n").filter(Boolean),
          salary: d.salary ? Number(d.salary) : undefined,
        }))} className="space-y-4">
          <FormField label="Title" error={errors.title}>
            <input type="text" {...register("title")} className="input" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category" error={errors.category}>
              <input type="text" {...register("category")} className="input" placeholder="e.g. ICT, Engineering" />
            </FormField>
            <FormField label="Internship Type" error={errors.internshipType}>
              <select {...register("internshipType")} className="input">
                <option value="">Select</option>
                <option value="Industrial Attachment">Industrial Attachment</option>
                <option value="Internship">Internship</option>
                <option value="Graduate Trainee">Graduate Trainee</option>
                <option value="Apprenticeship">Apprenticeship</option>
              </select>
            </FormField>
            <FormField label="Work Mode" error={errors.workMode}>
              <select {...register("workMode")} className="input">
                <option value="">Select</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </FormField>
            <FormField label="Location" error={errors.location}>
              <input type="text" {...register("location")} className="input" />
            </FormField>
            <FormField label="Duration" error={errors.duration}>
              <input type="text" {...register("duration")} className="input" placeholder="e.g. 3 months" />
            </FormField>
            <FormField label="Vacancies" error={errors.vacancies}>
              <input type="number" {...register("vacancies")} className="input" min={1} />
            </FormField>
            <FormField label="Application Deadline" error={errors.applicationDeadline}>
              <input type="date" {...register("applicationDeadline")} className="input" />
            </FormField>
            <FormField label="Salary (optional)" error={errors.salary}>
              <input type="number" {...register("salary")} className="input" placeholder="e.g. 30000" />
            </FormField>
          </div>
          <FormField label="Description" error={errors.description}>
            <textarea {...register("description")} rows={4} className="input" />
          </FormField>
          <FormField label="Requirements (one per line)" error={errors.requirements}>
            <textarea {...register("requirements")} rows={4} className="input" placeholder="Enter each requirement on a new line" />
          </FormField>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create Opportunity"}
          </button>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
