import { useQuery } from "@tanstack/react-query";
import { getSupervisors } from "../../api/supervisors";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";

export default function AdminSupervisors() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-supervisors"],
    queryFn: () => getSupervisors({ limit: 100 }),
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
  ];

  return (
    <div>
      <PageHeader title="Supervisors" subtitle="Manage all supervisor profiles" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
