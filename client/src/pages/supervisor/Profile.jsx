import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";

const schema = z.object({
  supervisorType: z.enum(["academic", "industrial"]),
  schoolId: z.string().optional(),
  companyId: z.string().optional(),
  department: z.string().min(1, "Required"),
  position: z.string().min(1, "Required"),
  phone: z.string().optional(),
});

export default function SupervisorProfile() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-supervisor-profile"],
    queryFn: () => api.get("/supervisors/me").then((r) => r.data.data),
    retry: false,
  });

  const { data: schools } = useQuery({
    queryKey: ["schools"],
    queryFn: () => api.get("/schools").then((r) => r.data.data?.items || r.data.data || []),
  });

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => api.get("/companies").then((r) => r.data.data?.items || r.data.data || []),
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    values: profile ? {
      supervisorType: profile.supervisorType || "academic",
      schoolId: profile.schoolId?._id || profile.schoolId || "",
      companyId: profile.companyId?._id || profile.companyId || "",
      department: profile.department || "",
      position: profile.position || "",
      phone: profile.phone || "",
    } : undefined,
  });

  const supType = watch("supervisorType");

  const mutation = useMutation({
    mutationFn: (data) =>
      profile?._id
        ? api.put(`/supervisors/${profile._id}`, data)
        : api.post("/supervisors", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-supervisor-profile"] });
      toast.success(profile?._id ? "Profile updated" : "Profile created");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader title="Supervisor Profile" subtitle={profile?._id ? "Update your information" : "Create your supervisor profile"} />
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Supervisor Type">
              <select {...register("supervisorType")} className="input">
                <option value="academic">Academic</option>
                <option value="industrial">Industrial</option>
              </select>
            </FormField>
            {supType === "academic" ? (
              <FormField label="School" error={errors.schoolId}>
                <select {...register("schoolId")} className="input">
                  <option value="">Select school</option>
                  {(Array.isArray(schools) ? schools : []).map((s) => (
                    <option key={s._id} value={s._id}>{s.schoolName}</option>
                  ))}
                </select>
              </FormField>
            ) : (
              <FormField label="Company" error={errors.companyId}>
                <select {...register("companyId")} className="input">
                  <option value="">Select company</option>
                  {(Array.isArray(companies) ? companies : []).map((c) => (
                    <option key={c._id} value={c._id}>{c.companyName}</option>
                  ))}
                </select>
              </FormField>
            )}
            <FormField label="Department" error={errors.department}>
              <input type="text" {...register("department")} className="input" />
            </FormField>
            <FormField label="Position" error={errors.position}>
              <input type="text" {...register("position")} className="input" />
            </FormField>
            <FormField label="Phone" error={errors.phone}>
              <input type="text" {...register("phone")} className="input" />
            </FormField>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : profile?._id ? "Update Profile" : "Create Profile"}
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
