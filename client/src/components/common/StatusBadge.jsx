const colors = {
  Active: { bg: "bg-green-100", text: "text-green-700" },
  Completed: { bg: "bg-blue-100", text: "text-blue-700" },
  Terminated: { bg: "bg-red-100", text: "text-red-700" },
  Draft: { bg: "bg-gray-100", text: "text-gray-600" },
  Submitted: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Approved: { bg: "bg-green-100", text: "text-green-700" },
  Rejected: { bg: "bg-red-100", text: "text-red-700" },
  Pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Shortlisted: { bg: "bg-blue-100", text: "text-blue-700" },
  Accepted: { bg: "bg-green-100", text: "text-green-700" },
  Withdrawn: { bg: "bg-gray-100", text: "text-gray-500" },
  Open: { bg: "bg-green-100", text: "text-green-700" },
  Closed: { bg: "bg-red-100", text: "text-red-700" },
  Filled: { bg: "bg-blue-100", text: "text-blue-700" },
};

export default function StatusBadge({ status }) {
  const c = colors[status] || { bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {status}
    </span>
  );
}
