import { useQuery } from "@tanstack/react-query";
import { getSchools } from "../../api/schools";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";

export default function AdminSchools() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-schools"],
    queryFn: () => getSchools({ limit: 100 }),
  });

  const items = data?.data?.items || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination;

  const columns = [
    { key: "schoolName", label: "School" },
    { key: "institutionType", label: "Type" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "verified", label: "Verified", render: (r) => r.verified ? "✓" : "—" },
  ];

  return (
    <div>
      <PageHeader title="Schools" subtitle="Manage all school profiles" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
