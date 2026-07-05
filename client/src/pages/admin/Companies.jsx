import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../../api/companies";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";

export default function AdminCompanies() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: () => getCompanies({ limit: 100 }),
  });

  const items = data?.data?.items || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination;

  const columns = [
    { key: "companyName", label: "Company" },
    { key: "industry", label: "Industry" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "verified", label: "Verified", render: (r) => r.verified ? "✓" : "—" },
  ];

  return (
    <div>
      <PageHeader title="Companies" subtitle="Manage all company profiles" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
