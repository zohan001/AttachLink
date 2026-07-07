import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOpportunities, deleteOpportunity } from "../../api/opportunities";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import { Trash2 } from "lucide-react";

export default function AdminOpportunities() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-opportunities"],
    queryFn: () => getOpportunities({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOpportunity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-opportunities"] }),
  });

  const items = data?.data?.opportunities || data?.data?.items || [];
  const pagination = data?.data?.pagination;

  const columns = [
    { key: "title", label: "Title" },
    { key: "companyId", label: "Company", render: (r) => r.companyId?.companyName || "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "location", label: "Location" },
    { key: "vacancies", label: "Vacancies" },
    { key: "applicationDeadline", label: "Deadline", render: (r) => r.applicationDeadline ? new Date(r.applicationDeadline).toLocaleDateString() : "—" },
    {
      key: "_actions",
      label: "",
      render: (r) => (
        <button
          onClick={() => { if (confirm("Delete this opportunity?")) deleteMutation.mutate(r._id); }}
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
      <PageHeader title="Opportunities" subtitle="View all opportunities" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
