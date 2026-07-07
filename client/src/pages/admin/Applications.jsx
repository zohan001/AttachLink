import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications, deleteApplication } from "../../api/applications";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import { Trash2 } from "lucide-react";

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => getApplications({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-applications"] }),
  });

  const items = data?.data?.items || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination;

  const columns = [
    { key: "studentId", label: "Student", render: (r) => `${r.studentId?.userId?.firstName || ""} ${r.studentId?.userId?.lastName || ""}` },
    { key: "opportunityId", label: "Opportunity", render: (r) => r.opportunityId?.title || "—" },
    { key: "companyId", label: "Company", render: (r) => r.companyId?.companyName || "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Applied", render: (r) => new Date(r.createdAt).toLocaleDateString() },
    {
      key: "_actions",
      label: "",
      render: (r) => (
        <button
          onClick={() => { if (confirm("Delete this application?")) deleteMutation.mutate(r._id); }}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Applications" subtitle="View all applications" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
