import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getAttachment, updateAttachment, assignSupervisor } from "../../api/attachments";
import { getSupervisors } from "../../api/supervisors";
import { handleApiError } from "../../utils/errorHandler";
import { ArrowLeft, BookOpen, ClipboardCheck, Pencil } from "lucide-react";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

function EditModal({ att, open, onClose }) {
  const qc = useQueryClient();
  const [startDate, setStartDate] = useState(att.startDate ? att.startDate.split("T")[0] : "");
  const [endDate, setEndDate] = useState(att.endDate ? att.endDate.split("T")[0] : "");
  const [academicId, setAcademicId] = useState(att.academicSupervisorId?._id || "");
  const [industrialId, setIndustrialId] = useState(att.industrialSupervisorId?._id || "");

  const { data: supervisorsData } = useQuery({
    queryKey: ["supervisors-all"],
    queryFn: () => getSupervisors({ limit: 200 }),
  });
  const supervisors = supervisorsData?.data || [];

  const saveMut = useMutation({
    mutationFn: async () => {
      if (startDate || endDate) {
        await updateAttachment(att._id, { startDate, endDate });
      }
      const prevAcademic = att.academicSupervisorId?._id || "";
      const prevIndustrial = att.industrialSupervisorId?._id || "";
      if (academicId && academicId !== prevAcademic) {
        await assignSupervisor(att._id, "academicSupervisorId", academicId);
      }
      if (industrialId && industrialId !== prevIndustrial) {
        await assignSupervisor(att._id, "industrialSupervisorId", industrialId);
      }
    },
    onSuccess: () => {
      toast.success("Attachment updated");
      qc.invalidateQueries({ queryKey: ["attachment", att._id] });
      onClose();
    },
    onError: (err) => handleApiError(err),
  });

  return (
    <Modal open={open} onClose={onClose} title="Edit Attachment">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Supervisor</label>
          <select value={academicId} onChange={(e) => setAcademicId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">— None —</option>
            {supervisors.filter((s) => s.supervisorType === "academic").map((s) => (
              <option key={s._id} value={s._id}>{s.userId?.firstName} {s.userId?.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industrial Supervisor</label>
          <select value={industrialId} onChange={(e) => setIndustrialId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">— None —</option>
              {supervisors.filter((s) => s.supervisorType === "industrial").map((s) => (
              <option key={s._id} value={s._id}>{s.userId?.firstName} {s.userId?.lastName}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={saveMut.mutate} disabled={saveMut.isPending}
            className="btn-primary px-4 py-2 text-sm">{saveMut.isPending ? "Saving..." : "Save"}</button>
          <button onClick={onClose} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

export default function AttachmentDetail() {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);
  const [showEdit, setShowEdit] = useState(false);

  const { data: att, isLoading } = useQuery({
    queryKey: ["attachment", id],
    queryFn: () => getAttachment(id),
  });

  if (isLoading) return <Loading />;
  if (!att) return <p className="text-center py-12 text-gray-400">Not found</p>;

  return (
    <div className="max-w-3xl">
      <Link to="/attachments" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Attachment Details</h2>
            <p className="text-sm text-gray-500 mt-1">{att.companyId?.companyName} — {att.opportunityId?.title}</p>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === "admin" && (
              <button onClick={() => setShowEdit(true)}
                className="btn-secondary inline-flex items-center gap-1 px-3 py-1.5 text-sm">
                <Pencil size={14} /> Edit
              </button>
            )}
            <StatusBadge status={att.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-gray-400">Student</span><p className="font-medium">{att.studentId?.userId?.firstName} {att.studentId?.userId?.lastName}</p></div>
          <div><span className="text-gray-400">Company</span><p className="font-medium">{att.companyId?.companyName}</p></div>
          <div><span className="text-gray-400">Start Date</span><p>{att.startDate ? new Date(att.startDate).toLocaleDateString() : "—"}</p></div>
          <div><span className="text-gray-400">End Date</span><p>{att.endDate ? new Date(att.endDate).toLocaleDateString() : "—"}</p></div>
          <div><span className="text-gray-400">Academic Supervisor</span><p>{att.academicSupervisorId?.userId?.firstName ? `${att.academicSupervisorId.userId.firstName} ${att.academicSupervisorId.userId.lastName}` : "—"}</p></div>
          <div><span className="text-gray-400">Industrial Supervisor</span><p>{att.industrialSupervisorId?.userId?.firstName ? `${att.industrialSupervisorId.userId.firstName} ${att.industrialSupervisorId.userId.lastName}` : "—"}</p></div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Link to={`/attachments/${id}/logbooks`} className="btn-secondary inline-flex items-center gap-2">
            <BookOpen size={16} /> Logbooks
          </Link>
          <Link to={`/attachments/${id}/evaluations`} className="btn-secondary inline-flex items-center gap-2">
            <ClipboardCheck size={16} /> Evaluations
          </Link>
        </div>
      </div>

      {showEdit && <EditModal att={att} open={showEdit} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
