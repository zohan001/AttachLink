import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus, ThumbsUp, ThumbsDown, MessageSquare, Send, ExternalLink } from "lucide-react";
import {
  getMyLogbooks,
  getAttachmentLogbooks,
  createLogbook,
  updateLogbook,
  submitLogbook,
  approveLogbook,
  rejectLogbook,
  commentLogbook,
} from "../../api/logbooks";
import { getMyAttachments } from "../../api/attachments";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

const logbookSchema = z.object({
  date: z.string().min(1, "Required"),
  activities: z.string().min(1, "Required"),
  hoursWorked: z.coerce.number().min(0.5).max(24),
  skillsLearned: z.string().optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
});

export default function LogbookList() {
  const { id: attachmentId } = useParams();
  const [searchParams] = useSearchParams();
  const attachId = attachmentId || searchParams.get("attachmentId");
  const { user } = useSelector((s) => s.auth);
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [comment, setComment] = useState("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["logbooks", attachId || "my", user?.role],
    queryFn: () => (attachId ? getAttachmentLogbooks(attachId) : getMyLogbooks()),
  });

  const { data: attachments } = useQuery({
    queryKey: ["my-attachments"],
    queryFn: getMyAttachments,
    enabled: !attachId && user?.role === "student",
  });

  const list = Array.isArray(items) ? items : [];

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(logbookSchema),
    values: editing || undefined,
  });

  const createMut = useMutation({
    mutationFn: (data) => attachId ? createLogbook({ ...data, attachmentId: attachId }) : createLogbook(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["logbooks"] }); toast.success("Created"); setShowForm(false); reset(); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateLogbook(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["logbooks"] }); toast.success("Updated"); setEditing(null); reset(); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const submitMut = useMutation({
    mutationFn: submitLogbook,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["logbooks"] }); toast.success("Submitted"); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const approveMut = useMutation({
    mutationFn: approveLogbook,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["logbooks"] }); toast.success("Approved"); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, supervisorComment }) => rejectLogbook(id, supervisorComment),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["logbooks"] }); toast.success("Rejected"); setCommentId(null); setComment(""); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const commentMut = useMutation({
    mutationFn: ({ id, supervisorComment }) => commentLogbook(id, supervisorComment),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["logbooks"] }); toast.success("Comment added"); setCommentId(null); setComment(""); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const handleFormSubmit = (data) => {
    if (editing) {
      updateMut.mutate({ id: editing._id, data });
    } else {
      createMut.mutate(data);
    }
  };

  return (
    <div>
      <PageHeader
        title="Logbooks"
        action={
          !attachId && user?.role === "student" ? null :
          user?.role === "student" && (
            <button onClick={() => { setEditing(null); reset({ date: "", activities: "", hoursWorked: 8, skillsLearned: "", challenges: "", solutions: "" }); setShowForm(true); }}
              className="btn-primary inline-flex items-center gap-2"><Plus size={18} /> New Entry</button>
          )
        }
      />

      {!attachId && user?.role === "student" && attachments?.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-700 font-medium mb-2">Select an attachment to add logbook entries:</p>
          <div className="flex flex-wrap gap-2">
            {attachments.map((att) => (
              <Link key={att._id} to={`/attachments/${att._id}/logbooks`}
                className="inline-flex items-center gap-1 text-sm bg-white px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-100">
                <ExternalLink size={14} /> {att.opportunityId?.title || att._id}
              </Link>
            ))}
          </div>
        </div>
      )}

      {!attachId && user?.role === "student" && (!attachments || attachments.length === 0) && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">You need an active attachment before you can create logbook entries.</p>
        </div>
      )}

      {isLoading ? <Loading /> : (
        <div className="space-y-4">
          {list.length === 0 ? <p className="text-center py-12 text-gray-400">No logbook entries yet</p> : null}
          {list.map((entry) => (
            <div key={entry._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">{entry.date ? new Date(entry.date).toLocaleDateString() : "—"}</span>
                    <StatusBadge status={entry.status} />
                    {entry.hoursWorked && <span className="text-xs text-gray-400">{entry.hoursWorked}h</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {entry.status === "Draft" && user?.role === "student" && (
                    <>
                      <button onClick={() => { setEditing(entry); setShowForm(true); }} className="text-xs text-indigo-600 hover:underline">Edit</button>
                      <button onClick={() => submitMut.mutate(entry._id)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <Send size={12} /> Submit
                      </button>
                    </>
                  )}
                  {entry.status === "Submitted" && user?.role === "supervisor" && (
                    <>
                      <button onClick={() => approveMut.mutate(entry._id)} className="text-xs text-green-600 hover:underline flex items-center gap-1">
                        <ThumbsUp size={12} /> Approve
                      </button>
                      <button onClick={() => setCommentId(entry._id)} className="text-xs text-red-600 hover:underline flex items-center gap-1">
                        <ThumbsDown size={12} /> Reject
                      </button>
                      <button onClick={() => { setComment(""); setCommentId(entry._id); }} className="text-xs text-gray-600 hover:underline flex items-center gap-1">
                        <MessageSquare size={12} /> Comment
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p><span className="font-medium">Activities:</span> {entry.activities}</p>
                {entry.skillsLearned && <p><span className="font-medium">Skills:</span> {entry.skillsLearned}</p>}
                {entry.challenges && <p><span className="font-medium">Challenges:</span> {entry.challenges}</p>}
                {entry.solutions && <p><span className="font-medium">Solutions:</span> {entry.solutions}</p>}
                {entry.supervisorComment && (
                  <p className="text-gray-500 italic mt-2">Supervisor: {entry.supervisorComment}</p>
                )}
              </div>

              {commentId === entry._id && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter comment..."
                    className="input flex-1 text-sm"
                  />
                  <button onClick={() => rejectMut.mutate({ id: entry._id, supervisorComment: comment })}
                    className="btn-danger text-xs px-3">Reject</button>
                  <button onClick={() => commentMut.mutate({ id: entry._id, supervisorComment: comment })}
                    className="btn-secondary text-xs px-3">Comment</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? "Edit Logbook Entry" : "New Logbook Entry"}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField label="Date" error={errors.date}>
            <input type="date" {...register("date")} className="input" />
          </FormField>
          <FormField label="Hours Worked" error={errors.hoursWorked}>
            <input type="number" step="0.5" {...register("hoursWorked")} className="input" />
          </FormField>
          <FormField label="Activities" error={errors.activities}>
            <textarea {...register("activities")} rows={3} className="input" />
          </FormField>
          <FormField label="Skills Learned" error={errors.skillsLearned}>
            <textarea {...register("skillsLearned")} rows={2} className="input" />
          </FormField>
          <FormField label="Challenges" error={errors.challenges}>
            <textarea {...register("challenges")} rows={2} className="input" />
          </FormField>
          <FormField label="Solutions" error={errors.solutions}>
            <textarea {...register("solutions")} rows={2} className="input" />
          </FormField>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : editing ? "Update" : "Create Entry"}
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
