import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import api from "../../api/client";
import { getSchools } from "../../api/schools";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import UploadField from "../../components/common/UploadField";

const schema = z.object({
  admissionNumber: z.string().min(1, "Required"),
  course: z.string().min(1, "Required"),
  department: z.string().min(1, "Required"),
  yearOfStudy: z.coerce.number().min(1).max(6),
  phone: z.string().min(10),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Required"),
  nationalId: z.string().min(1, "Required"),
  schoolId: z.string().min(1, "Select your school"),
});

export default function StudentProfile() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-student-profile"],
    queryFn: () => api.get("/students/me").then((r) => r.data.data),
    retry: false,
  });

  const { data: schoolsData } = useQuery({
    queryKey: ["schools"],
    queryFn: () => getSchools().then((r) => r.data || r || []),
  });
  const schools = Array.isArray(schoolsData) ? schoolsData : [];

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    values: profile ? {
      admissionNumber: profile.admissionNumber || "",
      course: profile.course || "",
      department: profile.department || "",
      yearOfStudy: profile.yearOfStudy || 1,
      phone: profile.phone || "",
      gender: profile.gender || "male",
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
      nationalId: profile.nationalId || "",
      schoolId: profile.schoolId?._id || profile.schoolId || "",
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      profile?._id
        ? api.put(`/students/${profile._id}`, data)
        : api.post("/students", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-student-profile"] });
      toast.success(profile?._id ? "Profile updated" : "Profile created");
    },
    onError: (err) => handleApiError(err),
  });

  const cvMutation = useMutation({
    mutationFn: (url) => api.put(`/students/${profile._id}`, { cvUrl: url }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-student-profile"] });
      toast.success("CV updated");
    },
    onError: (err) => handleApiError(err),
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageHeader title="Student Profile" subtitle={profile?._id ? "Update your information" : "Create your profile to get started"} />
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Admission No" error={errors.admissionNumber}>
              <input type="text" {...register("admissionNumber")} className="input" />
            </FormField>
            <FormField label="Course" error={errors.course}>
              <input type="text" {...register("course")} className="input" />
            </FormField>
            <FormField label="Department" error={errors.department}>
              <input type="text" {...register("department")} className="input" />
            </FormField>
            <FormField label="Year of Study" error={errors.yearOfStudy}>
              <select {...register("yearOfStudy")} className="input">
                {[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </FormField>
            <FormField label="Phone" error={errors.phone}>
              <input type="text" {...register("phone")} className="input" />
            </FormField>
            <FormField label="Gender" error={errors.gender}>
              <select {...register("gender")} className="input">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <FormField label="Date of Birth" error={errors.dateOfBirth}>
              <input type="date" {...register("dateOfBirth")} className="input" />
            </FormField>
            <FormField label="National ID" error={errors.nationalId}>
              <input type="text" {...register("nationalId")} className="input" />
            </FormField>
            <FormField label="School" error={errors.schoolId}>
              <select {...register("schoolId")} className="input">
                <option value="">Select school...</option>
                {schools.map((s) => (
                  <option key={s._id} value={s._id}>{s.schoolName}</option>
                ))}
              </select>
            </FormField>
          </div>

          <UploadField
            folder="cvs"
            accept=".pdf,.doc,.docx"
            label="Upload CV (PDF, DOC, DOCX)"
            currentUrl={profile?.cvUrl}
            onUpload={(url) => url && cvMutation.mutate(url)}
          />

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
