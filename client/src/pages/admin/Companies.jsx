import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanies, deleteCompany } from "../../api/companies";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import { Trash2 } from "lucide-react";

export default function AdminCompanies() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: () => getCompanies({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-companies"] }),
  });

  const items = data?.data?.items || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination;

  const columns = [
    { key: "companyName", label: "Company" },
    { key: "industry", label: "Industry" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "verified", label: "Verified", render: (r) => r.verified ? "✓" : "—" },
    {
      key: "_actions",
      label: "",
      render: (r) => (
        <button
          onClick={() => { if (confirm("Delete this company?")) deleteMutation.mutate(r._id); }}
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
      <PageHeader title="Companies" subtitle="Manage all company profiles" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
