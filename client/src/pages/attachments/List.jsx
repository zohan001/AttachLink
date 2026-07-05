import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getMyAttachments, getAttachments, completeAttachment, terminateAttachment } from "../../api/attachments";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

export default function AttachmentList() {
  const { user } = useSelector((s) => s.auth);
  const qc = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["attachments", user?.role],
    queryFn: () => (user?.role === "student" ? getMyAttachments() : getAttachments({})),
  });

  const list = Array.isArray(items) ? items : [];

  const completeMut = useMutation({
    mutationFn: completeAttachment,
    onSuccess: () => { toast.success("Completed"); qc.invalidateQueries({ queryKey: ["attachments"] }); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const terminateMut = useMutation({
    mutationFn: terminateAttachment,
    onSuccess: () => { toast.success("Terminated"); qc.invalidateQueries({ queryKey: ["attachments"] }); },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
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

  return (
    <div>
      <PageHeader title="Attachments" />
      <DataTable columns={columns} data={list} loading={isLoading} />
    </div>
  );
}
