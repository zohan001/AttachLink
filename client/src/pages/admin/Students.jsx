import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudents, deleteStudent } from "../../api/students";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import { Trash2 } from "lucide-react";

export default function AdminStudents() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-students"],
    queryFn: () => getStudents({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-students"] }),
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
    {
      key: "_actions",
      label: "",
      render: (r) => (
        <button
          onClick={() => { if (confirm("Delete this student?")) deleteMutation.mutate(r._id); }}
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
      <PageHeader title="Students" subtitle="Manage all student profiles" />
      <DataTable columns={columns} data={items} loading={isLoading} searchable pagination={pagination} />
    </div>
  );
}
