import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupervisors, deleteSupervisor } from "../../api/supervisors";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import { Trash2 } from "lucide-react";

export default function AdminSupervisors() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-supervisors"],
    queryFn: () => getSupervisors({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSupervisor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-supervisors"] }),
  });

  const items = data?.data?.items || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination;

  const columns = [
    { key: "userId", label: "Name", render: (r) => `${r.userId?.firstName || ""} ${r.userId?.lastName || ""}` },
    { key: "supervisorType", label: "Type" },
    { key: "schoolId", label: "School", render: (r) => r.schoolId?.schoolName || "—" },
    { key: "companyId", label: "Company", render: (r) => r.companyId?.companyName || "—" },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
    {
      key: "_actions",
      label: "",
      render: (r) => (
        <button
          onClick={() => { if (confirm("Delete this supervisor?")) deleteMutation.mutate(r._id); }}
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
      <PageHeader title="Supervisors" subtitle="Manage all supervisor profiles" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
