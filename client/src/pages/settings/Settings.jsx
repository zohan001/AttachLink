import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import api from "../../api/client";
import PageHeader from "../../components/common/PageHeader";

const pwSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(6, "Min 6 characters"),
  confirmNewPassword: z.string().min(1, "Required"),
}).refine((d) => d.newPassword === d.confirmNewPassword, { message: "Passwords don't match", path: ["confirmNewPassword"] });

export default function Settings() {
  const { user } = useSelector((s) => s.auth);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(pwSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => api.put("/auth/update-password", data),
    onSuccess: () => { toast.success("Password updated"); reset(); },
    onError: (err) => handleApiError(err),
  });

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Settings" />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Account</h3>
        <p className="text-sm text-gray-500 mb-4">
          {user?.firstName} {user?.lastName} — <span className="capitalize">{user?.role}</span> ({user?.email})
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" {...register("currentPassword")} className="input" />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" {...register("newPassword")} className="input" />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" {...register("confirmNewPassword")} className="input" />
            {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
