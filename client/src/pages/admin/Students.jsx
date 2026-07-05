import { useQuery } from "@tanstack/react-query";
import { getStudents } from "../../api/students";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";

export default function AdminStudents() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-students"],
    queryFn: () => getStudents({ limit: 100 }),
  });

  const items = data?.data?.items || data?.data || [];
  const pagination = data?.data?.pagination || data?.pagination;

  const columns = [
    { key: "admissionNumber", label: "Admission No" },
    { key: "userId", label: "Name", render: (r) => `${r.userId?.firstName || ""} ${r.userId?.lastName || ""}` },
    { key: "email", label: "Email", render: (r) => r.userId?.email || "—" },
    { key: "course", label: "Course" },
    { key: "department", label: "Department" },
    { key: "yearOfStudy", label: "Year" },
    { key: "phone", label: "Phone" },
  ];

  return (
    <div>
      <PageHeader title="Students" subtitle="Manage all student profiles" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
