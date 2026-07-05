import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getStudentReport, getAttachmentReport, getCompanyReport } from "../../api/reports";
import { getStudents } from "../../api/students";
import { getCompanies } from "../../api/companies";
import { getAttachments } from "../../api/attachments";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import { FileText, Download } from "lucide-react";

export default function ReportList() {
  const { user } = useSelector((s) => s.auth);
  const [type, setType] = useState("student");
  const [selectedId, setSelectedId] = useState("");

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents({}).then((r) => r.data?.items || r.data || []),
    enabled: type === "student",
  });

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanies({}).then((r) => r.data?.items || r.data || []),
    enabled: type === "company",
  });

  const { data: attachments } = useQuery({
    queryKey: ["attachments"],
    queryFn: () => getAttachments({}).then((r) => r.data?.items || r.data || []),
    enabled: type === "attachment",
  });

  const { data: report, isLoading } = useQuery({
    queryKey: ["report", type, selectedId],
    queryFn: () => {
      if (!selectedId) return null;
      if (type === "student") return getStudentReport(selectedId);
      if (type === "company") return getCompanyReport(selectedId);
      return getAttachmentReport(selectedId);
    },
    enabled: !!selectedId,
  });

  return (
    <div>
      <PageHeader title="Reports" />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <select value={type} onChange={(e) => { setType(e.target.value); setSelectedId(""); }} className="input max-w-xs">
            <option value="student">Student Report</option>
            <option value="company">Company Report</option>
            <option value="attachment">Attachment Report</option>
          </select>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="input max-w-xs">
            <option value="">Select {type}...</option>
            {(type === "student" ? (Array.isArray(students) ? students : []) : type === "company" ? (Array.isArray(companies) ? companies : []) : (Array.isArray(attachments) ? attachments : [])).map((item) => (
              <option key={item._id} value={item._id}>
                {type === "student" ? `${item.userId?.firstName || ""} ${item.userId?.lastName || ""} (${item.admissionNumber || ""})`
                  : type === "company" ? item.companyName
                  : `${item.studentId?.userId?.firstName || ""} ${item.studentId?.userId?.lastName || ""} @ ${item.companyId?.companyName || ""}`}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <Loading />}

        {report && !isLoading && (
          <div className="text-sm text-gray-600">
            <h3 className="font-semibold text-gray-900 mb-4">Report Summary</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-xs">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
