import { useQuery } from "@tanstack/react-query";
import { getApplications } from "../../api/applications";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";

export default function AdminApplications() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => getApplications({ limit: 100 }),
  });

  const items = data?.data?.items || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination;

  const columns = [
    { key: "studentId", label: "Student", render: (r) => `${r.studentId?.userId?.firstName || ""} ${r.studentId?.userId?.lastName || ""}` },
    { key: "opportunityId", label: "Opportunity", render: (r) => r.opportunityId?.title || "—" },
    { key: "companyId", label: "Company", render: (r) => r.companyId?.companyName || "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Applied", render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <PageHeader title="Applications" subtitle="View all applications" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
