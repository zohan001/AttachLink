import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import { getMyAttachments, getAttachments, completeAttachment, terminateAttachment } from "../../api/attachments";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import { Link } from "react-router-dom";
import { Eye, AlertCircle, UserPlus } from "lucide-react";

export default function AttachmentList() {
  const { user } = useSelector((s) => s.auth);
  const qc = useQueryClient();

  const { data: items, isLoading, error } = useQuery({
    queryKey: ["attachments", user?.role],
    queryFn: () => (user?.role === "student" ? getMyAttachments() : getAttachments({})),
    retry: false,
  });

  const list = Array.isArray(items) ? items : [];
  const noProfile = error?.response?.status === 404 && user?.role === "student";

  const completeMut = useMutation({
    mutationFn: completeAttachment,
    onSuccess: () => { toast.success("Completed"); qc.invalidateQueries({ queryKey: ["attachments"] }); },
    onError: (err) => handleApiError(err),
  });

  const terminateMut = useMutation({
    mutationFn: terminateAttachment,
    onSuccess: () => { toast.success("Terminated"); qc.invalidateQueries({ queryKey: ["attachments"] }); },
    onError: (err) => handleApiError(err),
  });

  const columns = [
    { key: "studentId", label: "Student", render: (r) => `${r.studentId?.userId?.firstName || ""} ${r.studentId?.userId?.lastName || ""}` || "—" },
    { key: "companyId", label: "Company", render: (r) => r.companyId?.companyName || "—" },
    { key: "opportunityId", label: "Opportunity", render: (r) => r.opportunityId?.title || "—" },
    { key: "startDate", label: "Start", render: (r) => r.startDate ? new Date(r.startDate).toLocaleDateString() : "—" },
    { key: "endDate", label: "End", render: (r) => r.endDate ? new Date(r.endDate).toLocaleDateString() : "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", label: "", render: (r) => (
        <div className="flex gap-2">
          <Link to={`/attachments/${r._id}`} className="text-indigo-600 text-xs hover:underline inline-flex items-center gap-1">
            <Eye size={14} /> View
          </Link>
          {r.status === "Active" && user?.role === "admin" && (
            <>
              <button onClick={() => completeMut.mutate(r._id)} className="text-green-600 text-xs hover:underline">Complete</button>
              <button onClick={() => terminateMut.mutate(r._id)} className="text-red-500 text-xs hover:underline">Terminate</button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (noProfile) {
    return (
      <div>
        <PageHeader title="Attachments" />
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <UserPlus size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Complete Your Profile First</h3>
          <p className="text-gray-500 mb-4">You need to set up your student profile before you can view attachments.</p>
          <Link to="/profile/student" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            <UserPlus size={16} /> Create Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Attachments" />
      {list.length === 0 && !isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Attachments Yet</h3>
          <p className="text-gray-500">
            Attachments are created when your application is accepted. Apply to an opportunity first.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={list} loading={isLoading} />
      )}
    </div>
  );
}
