import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAttachment } from "../../api/attachments";
import { ArrowLeft, BookOpen, ClipboardCheck } from "lucide-react";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";

export default function AttachmentDetail() {
  const { id } = useParams();

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
          <StatusBadge status={att.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-gray-400">Student</span><p className="font-medium">{att.studentId?.userId?.firstName} {att.studentId?.userId?.lastName}</p></div>
          <div><span className="text-gray-400">Company</span><p className="font-medium">{att.companyId?.companyName}</p></div>
          <div><span className="text-gray-400">Start Date</span><p>{att.startDate ? new Date(att.startDate).toLocaleDateString() : "—"}</p></div>
          <div><span className="text-gray-400">End Date</span><p>{att.endDate ? new Date(att.endDate).toLocaleDateString() : "—"}</p></div>
          {att.academicSupervisorId && <div><span className="text-gray-400">Academic Supervisor</span><p>{att.academicSupervisorId?.userId?.firstName} {att.academicSupervisorId?.userId?.lastName}</p></div>}
          {att.industrialSupervisorId && <div><span className="text-gray-400">Industrial Supervisor</span><p>{att.industrialSupervisorId?.userId?.firstName} {att.industrialSupervisorId?.userId?.lastName}</p></div>}
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
    </div>
  );
}
