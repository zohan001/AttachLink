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
  schoolName: z.string().min(1, "Required"),
  institutionType: z.string().min(1, "Required"),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().optional(),
});

export default function SchoolProfile() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-school-profile"],
    queryFn: () => api.get("/schools/me").then((r) => r.data.data),
    retry: false,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    values: profile ? {
      schoolName: profile.schoolName || "",
      institutionType: profile.institutionType || "University",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      profile?._id
        ? api.put(`/schools/${profile._id}`, data)
        : api.post("/schools", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-school-profile"] });
      toast.success(profile?._id ? "Profile updated" : "Profile created");
    },
    onError: (err) => handleApiError(err),
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader title="School Profile" subtitle={profile?._id ? "Update your information" : "Create your school profile"} />
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField label="School Name" error={errors.schoolName}>
                <input type="text" {...register("schoolName")} className="input" />
              </FormField>
            </div>
            <FormField label="Institution Type" error={errors.institutionType}>
              <select {...register("institutionType")} className="input">
                {["University", "TVET", "College", "High School", "Training Institute"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Email" error={errors.email}>
              <input type="email" {...register("email")} className="input" />
            </FormField>
            <FormField label="Phone" error={errors.phone}>
              <input type="text" {...register("phone")} className="input" />
            </FormField>
            <div className="col-span-2">
              <FormField label="Address" error={errors.address}>
                <textarea {...register("address")} rows={2} className="input" />
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
