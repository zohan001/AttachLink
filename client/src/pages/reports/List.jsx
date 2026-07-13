import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getStudentReport, getAttachmentReport, getCompanyReport } from "../../api/reports";
import { getStudents } from "../../api/students";
import { getCompanies } from "../../api/companies";
import { getAttachments } from "../../api/attachments";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import { FileText, Download } from "lucide-react";

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

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
    queryFn: () => getAttachments({}).then((r) => Array.isArray(r) ? r : r.data?.items || r.data || []),
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
            {user?.role === "admin" && <option value="company">Company Report</option>}
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
          <div className="text-sm text-gray-600 space-y-4">
            <h3 className="font-semibold text-gray-900 text-base">Report Summary</h3>

            {type === "student" && report.student && (
              <div className="bg-indigo-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Name:</span> <span className="text-gray-800 font-medium">{report.student.user?.firstName} {report.student.user?.lastName}</span></div>
                  <div><span className="text-gray-400">Admission:</span> <span className="text-gray-800">{report.student.admissionNumber}</span></div>
                  <div><span className="text-gray-400">Course:</span> <span className="text-gray-800">{report.student.course}</span></div>
                  <div><span className="text-gray-400">Department:</span> <span className="text-gray-800">{report.student.department}</span></div>
                  <div><span className="text-gray-400">Year:</span> <span className="text-gray-800">{report.student.yearOfStudy}</span></div>
                </div>
              </div>
            )}

            {type === "company" && report.company && (
              <div className="bg-emerald-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Company:</span> <span className="text-gray-800 font-medium">{report.company.companyName}</span></div>
                  <div><span className="text-gray-400">Industry:</span> <span className="text-gray-800">{report.company.industry}</span></div>
                  <div><span className="text-gray-400">City:</span> <span className="text-gray-800">{report.company.city}</span></div>
                  <div><span className="text-gray-400">Verified:</span> <span className="text-gray-800">{report.company.verified ? "Yes" : "No"}</span></div>
                </div>
              </div>
            )}

            {type === "attachment" && report.attachment && (
              <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Status:</span> <StatusBadge status={report.attachment.status} /></div>
                  <div><span className="text-gray-400">Start:</span> <span className="text-gray-800">{report.attachment.startDate ? new Date(report.attachment.startDate).toLocaleDateString() : "—"}</span></div>
                  <div><span className="text-gray-400">End:</span> <span className="text-gray-800">{report.attachment.endDate ? new Date(report.attachment.endDate).toLocaleDateString() : "—"}</span></div>
                </div>
              </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {type === "student" && <>
                <StatCard label="Logbook Entries" value={report.logbookSummary?.total} />
                <StatCard label="Approved" value={report.logbookSummary?.approved} />
                <StatCard label="Total Hours" value={report.logbookSummary?.totalHoursWorked} />
                <StatCard label="Avg Score" value={report.evaluationSummary?.averageOverallScore} />
              </>}
              {type === "company" && <>
                <StatCard label="Opportunities" value={report.opportunities?.total} />
                <StatCard label="Active" value={report.opportunities?.active} />
                <StatCard label="Attachments" value={report.attachments?.total} />
                <StatCard label="Students" value={report.attachments?.uniqueStudents} />
              </>}
              {type === "attachment" && <>
                <StatCard label="Logbook Entries" value={report.logbooks?.total} />
                <StatCard label="Total Hours" value={report.logbooks?.totalHours} />
                <StatCard label="Work Days" value={report.logbooks?.uniqueDays} />
                <StatCard label="Evaluations" value={report.evaluations?.total} />
              </>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
