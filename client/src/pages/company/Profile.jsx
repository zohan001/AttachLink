import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";

const schema = z.object({
  companyName: z.string().min(1, "Required"),
  industry: z.string().min(1, "Required"),
  email: z.string().email(),
  phone: z.string().min(10),
  description: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
});

export default function CompanyProfile() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-company-profile"],
    queryFn: () => api.get("/companies/me").then((r) => r.data.data),
    retry: false,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    values: profile ? {
      companyName: profile.companyName || "",
      industry: profile.industry || "",
      email: profile.email || "",
      phone: profile.phone || "",
      description: profile.description || "",
      website: profile.website || "",
      location: profile.location || "",
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      profile?._id
        ? api.put(`/companies/${profile._id}`, data)
        : api.post("/companies", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-company-profile"] });
      toast.success(profile?._id ? "Profile updated" : "Profile created");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader title="Company Profile" subtitle={profile?._id ? "Update your information" : "Create your company profile"} />
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField label="Company Name" error={errors.companyName}>
                <input type="text" {...register("companyName")} className="input" />
              </FormField>
            </div>
            <FormField label="Industry" error={errors.industry}>
              <input type="text" {...register("industry")} className="input" />
            </FormField>
            <FormField label="Email" error={errors.email}>
              <input type="email" {...register("email")} className="input" />
            </FormField>
            <FormField label="Phone" error={errors.phone}>
              <input type="text" {...register("phone")} className="input" />
            </FormField>
            <FormField label="Website" error={errors.website}>
              <input type="text" {...register("website")} className="input" />
            </FormField>
            <FormField label="Location" error={errors.location}>
              <input type="text" {...register("location")} className="input" />
            </FormField>
            <div className="col-span-2">
              <FormField label="Description" error={errors.description}>
                <textarea {...register("description")} rows={3} className="input" />
              </FormField>
            </div>
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
