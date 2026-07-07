import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchools, deleteSchool } from "../../api/schools";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import { Trash2 } from "lucide-react";

export default function AdminSchools() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-schools"],
    queryFn: () => getSchools({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-schools"] }),
  });

  const items = data?.data?.items || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination;

  const columns = [
    { key: "schoolName", label: "School" },
    { key: "institutionType", label: "Type" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "verified", label: "Verified", render: (r) => r.verified ? "✓" : "—" },
    {
      key: "_actions",
      label: "",
      render: (r) => (
        <button
          onClick={() => { if (confirm("Delete this school?")) deleteMutation.mutate(r._id); }}
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
      <PageHeader title="Schools" subtitle="Manage all school profiles" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
