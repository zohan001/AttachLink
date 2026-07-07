import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import api from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  description: z.string().optional(),
  website: z.string().url("Must be a valid URL (e.g. https://example.com)").optional().or(z.literal("")),
  registrationNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
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
      registrationNumber: profile.registrationNumber || "",
      address: profile.address || "",
      city: profile.city || "",
      county: profile.county || "",
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
    onError: (err) => handleApiError(err),
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
              <input type="url" {...register("website")} className="input" placeholder="https://example.com" />
            </FormField>
            <FormField label="Registration Number" error={errors.registrationNumber}>
              <input type="text" {...register("registrationNumber")} className="input" />
            </FormField>
            <FormField label="City" error={errors.city}>
              <input type="text" {...register("city")} className="input" />
            </FormField>
            <FormField label="County" error={errors.county}>
              <input type="text" {...register("county")} className="input" />
            </FormField>
            <FormField label="Address" error={errors.address}>
              <input type="text" {...register("address")} className="input" />
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
