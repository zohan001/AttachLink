import { useQuery } from "@tanstack/react-query";
import { getOpportunities } from "../../api/opportunities";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";

export default function AdminOpportunities() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-opportunities"],
    queryFn: () => getOpportunities({ limit: 100 }),
  });

  const items = data?.data?.items || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination;

  const columns = [
    { key: "title", label: "Title" },
    { key: "companyId", label: "Company", render: (r) => r.companyId?.companyName || "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "location", label: "Location" },
    { key: "vacancies", label: "Vacancies" },
    { key: "applicationDeadline", label: "Deadline", render: (r) => r.applicationDeadline ? new Date(r.applicationDeadline).toLocaleDateString() : "—" },
  ];

  return (
    <div>
      <PageHeader title="Opportunities" subtitle="View all opportunities" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
