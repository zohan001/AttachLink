import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { getOpportunity, createOpportunity, updateOpportunity } from "../../api/opportunities";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  requirements: z.string().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
  stipend: z.string().optional(),
  vacancies: z.coerce.number().min(1).optional(),
  applicationDeadline: z.string().optional(),
  workMode: z.string().optional(),
  category: z.string().optional(),
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
      requirements: opp.requirements || "",
      location: opp.location || "",
      duration: opp.duration || "",
      stipend: opp.stipend || "",
      vacancies: opp.vacancies || 1,
      applicationDeadline: opp.applicationDeadline ? opp.applicationDeadline.slice(0, 10) : "",
      workMode: opp.workMode || "",
      category: opp.category || "",
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
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  if (isEdit && isLoading) return <Loading />;

  return (
    <div className="max-w-2xl">
      <PageHeader title={isEdit ? "Edit Opportunity" : "Post Opportunity"} />
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <FormField label="Title" error={errors.title}>
            <input type="text" {...register("title")} className="input" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category" error={errors.category}>
              <input type="text" {...register("category")} className="input" placeholder="e.g. ICT, Engineering" />
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
            <FormField label="Stipend" error={errors.stipend}>
              <input type="text" {...register("stipend")} className="input" placeholder="e.g. KES 30,000" />
            </FormField>
            <FormField label="Vacancies" error={errors.vacancies}>
              <input type="number" {...register("vacancies")} className="input" min={1} />
            </FormField>
            <FormField label="Application Deadline" error={errors.applicationDeadline}>
              <input type="date" {...register("applicationDeadline")} className="input" />
            </FormField>
          </div>
          <FormField label="Description" error={errors.description}>
            <textarea {...register("description")} rows={4} className="input" />
          </FormField>
          <FormField label="Requirements" error={errors.requirements}>
            <textarea {...register("requirements")} rows={4} className="input" />
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
