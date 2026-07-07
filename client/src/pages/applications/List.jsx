import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import { getMyApplications, getCompanyApplications, withdrawApplication, updateApplicationStatus } from "../../api/applications";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";

export default function ApplicationList() {
  const { user } = useSelector((s) => s.auth);
  const qc = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["applications", user?.role],
    queryFn: user?.role === "company" ? getCompanyApplications : getMyApplications,
  });

  const withdrawMut = useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => { toast.success("Withdrawn"); qc.invalidateQueries({ queryKey: ["applications"] }); },
    onError: (err) => handleApiError(err),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["applications"] }); },
    onError: (err) => handleApiError(err),
  });

  const list = Array.isArray(items) ? items : [];

  const studentColumns = [
    { key: "opportunityId", label: "Opportunity", render: (r) => r.opportunityId?.title || "—" },
    { key: "companyId", label: "Company", render: (r) => r.companyId?.companyName || "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Applied", render: (r) => new Date(r.createdAt).toLocaleDateString() },
    {
      key: "actions", label: "", render: (r) =>
        ["Pending", "Under Review", "Shortlisted", "Interview Scheduled"].includes(r.status) ? (
          <button onClick={() => withdrawMut.mutate(r._id)} className="text-red-500 text-xs hover:underline">Withdraw</button>
        ) : null,
    },
  ];

  const companyColumns = [
    { key: "studentId", label: "Student", render: (r) => `${r.studentId?.userId?.firstName || ""} ${r.studentId?.userId?.lastName || ""}` },
    { key: "opportunityId", label: "Opportunity", render: (r) => r.opportunityId?.title || "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Applied", render: (r) => new Date(r.createdAt).toLocaleDateString() },
    {
      key: "actions", label: "Action", render: (r) =>
        r.status === "Pending" ? (
          <select
            onChange={(e) => statusMut.mutate({ id: r._id, status: e.target.value })}
            className="text-xs border border-gray-300 rounded px-2 py-1"
            defaultValue=""
          >
            <option value="" disabled>Update</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        ) : r.status === "Shortlisted" ? (
          <select
            onChange={(e) => statusMut.mutate({ id: r._id, status: e.target.value })}
            className="text-xs border border-gray-300 rounded px-2 py-1"
            defaultValue=""
          >
            <option value="" disabled>Update</option>
            <option value="Interview Scheduled">Schedule Interview</option>
            <option value="Rejected">Rejected</option>
          </select>
        ) : r.status === "Interview Scheduled" ? (
          <select
            onChange={(e) => statusMut.mutate({ id: r._id, status: e.target.value })}
            className="text-xs border border-gray-300 rounded px-2 py-1"
            defaultValue=""
          >
            <option value="" disabled>Update</option>
            <option value="Accepted">Accept</option>
            <option value="Rejected">Reject</option>
          </select>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader title="Applications" />
      <DataTable
        columns={user?.role === "company" ? companyColumns : studentColumns}
        data={list}
        loading={isLoading}
      />
    </div>
  );
}
