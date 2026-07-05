import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus, Send } from "lucide-react";
import {
  getMyEvaluations,
  getAttachmentEvaluations,
  createEvaluation,
  updateEvaluation,
  submitEvaluation,
} from "../../api/evaluations";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

const criteriaKeys = [
  "punctuality", "professionalism", "communication", "technicalSkills",
  "teamwork", "problemSolving", "adaptability", "overallPerformance",
];

const evalSchema = z.object({
  attachmentId: z.string().min(1, "Required"),
  criteria: z.object(
    Object.fromEntries(criteriaKeys.map((k) => [k, z.coerce.number().min(1).max(5)]))
  ),
  comments: z.string().optional(),
});

export default function EvaluationList() {
  const { id: attachmentId } = useParams();
  const [searchParams] = useSearchParams();
  const attachId = attachmentId || searchParams.get("attachmentId");
  const { user } = useSelector((s) => s.auth);
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["evaluations", attachId || "my"],
    queryFn: () => (attachId ? getAttachmentEvaluations(attachId) : getMyEvaluations()),
  });

  const list = Array.isArray(items) ? items : [];

  const defaultCriteria = Object.fromEntries(criteriaKeys.map((k) => [k, 3]));

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(evalSchema),
    values: editing ? {
      attachmentId: editing.attachmentId?._id || editing.attachmentId,
      criteria: editing.criteria || defaultCriteria,
      comments: editing.comments || "",
    } : undefined,
  });

  const createMut = useMutation({
    mutationFn: (data) => createEvaluation(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["evaluations"] }); toast.success("Created"); setShowForm(false); reset(); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateEvaluation(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["evaluations"] }); toast.success("Updated"); setEditing(null); reset(); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const submitMut = useMutation({
    mutationFn: submitEvaluation,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["evaluations"] }); toast.success("Submitted"); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const handleFormSubmit = (data) => {
    if (editing) updateMut.mutate({ id: editing._id, data });
    else createMut.mutate(data);
  };

  const avg = (criteria) => {
    if (!criteria) return "—";
    const vals = criteriaKeys.map((k) => Number(criteria[k]) || 0);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  return (
    <div>
      <PageHeader
        title="Evaluations"
        action={
          user?.role === "supervisor" && (
            <button onClick={() => { setEditing(null); reset({ attachmentId: attachId || "", criteria: { ...defaultCriteria }, comments: "" }); setShowForm(true); }}
              className="btn-primary inline-flex items-center gap-2"><Plus size={18} /> New Evaluation</button>
          )
        }
      />

      {isLoading ? <Loading /> : (
        <div className="space-y-4">
          {list.length === 0 && <p className="text-center py-12 text-gray-400">No evaluations yet</p>}
          {list.map((evalItem) => (
            <div key={evalItem._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {evalItem.studentId?.userId?.firstName} {evalItem.studentId?.userId?.lastName}
                    </span>
                    <StatusBadge status={evalItem.status} />
                    <span className="text-sm font-bold text-indigo-600">Score: {avg(evalItem.criteria)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{evalItem.evaluatorType} supervisor</p>
                </div>
                {evalItem.status === "Draft" && user?.role === "supervisor" && (
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(evalItem); setShowForm(true); }} className="text-xs text-indigo-600 hover:underline">Edit</button>
                    <button onClick={() => submitMut.mutate(evalItem._id)} className="text-xs text-green-600 hover:underline flex items-center gap-1">
                      <Send size={12} /> Submit
                    </button>
                  </div>
                )}
              </div>
              {evalItem.comments && <p className="text-sm text-gray-600 mt-2">{evalItem.comments}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? "Edit Evaluation" : "New Evaluation"} size="lg">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {!attachId && (
            <FormField label="Attachment ID" error={errors.attachmentId}>
              <input type="text" {...register("attachmentId")} className="input" />
            </FormField>
          )}
          <div className="grid grid-cols-2 gap-4">
            {criteriaKeys.map((key) => (
              <FormField key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} error={errors.criteria?.[key]}>
                <select {...register(`criteria.${key}`)} className="input">
                  {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </FormField>
            ))}
          </div>
          <FormField label="Comments" error={errors.comments}>
            <textarea {...register("comments")} rows={3} className="input" />
          </FormField>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : editing ? "Update" : "Create Evaluation"}
          </button>
        </form>
      </Modal>
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
