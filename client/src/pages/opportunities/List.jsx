import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Eye, MapPin, Clock, Briefcase } from "lucide-react";
import { useSelector } from "react-redux";
import { getOpportunities, getMyOpportunities } from "../../api/opportunities";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";

export default function OpportunityList() {
  const { user } = useSelector((s) => s.auth);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const isCompany = user?.role === "company";

  const allQuery = useQuery({
    queryKey: ["opportunities", search, page],
    queryFn: () => getOpportunities({ search, page, limit: 10 }),
    enabled: tab === "all",
  });

  const myQuery = useQuery({
    queryKey: ["my-opportunities"],
    queryFn: () => getMyOpportunities(),
    enabled: tab === "my",
  });

  const data = tab === "all" ? allQuery : myQuery;
  const items = tab === "all"
    ? (allQuery.data?.data?.opportunities || [])
    : (myQuery.data || []);
  const pagination = tab === "all" ? allQuery.data?.data?.pagination : null;

  return (
    <div>
      <PageHeader
        title={tab === "my" ? "My Opportunities" : "Opportunities"}
        action={
          user?.role === "company" && (
            <Link to="/opportunities/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> Post Opportunity
            </Link>
          )
        }
      />

      {isCompany && (
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => { setTab("all"); setPage(1); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            All
          </button>
          <button
            onClick={() => setTab("my")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === "my" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            My
          </button>
        </div>
      )}

      {tab === "all" && (
        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search opportunities..."
            className="input max-w-md"
          />
        </div>
      )}

      {data.isLoading ? <Loading /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center py-12">No opportunities found</p>
          ) : items.map((opp) => (
            <div key={opp._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{opp.title}</h3>
                <StatusBadge status={opp.status} />
              </div>
              {opp.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{opp.description}</p>}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                {opp.location && <span className="flex items-center gap-1"><MapPin size={14} />{opp.location}</span>}
                {opp.duration && <span className="flex items-center gap-1"><Clock size={14} />{opp.duration}</span>}
                {opp.vacancies && <span className="flex items-center gap-1"><Briefcase size={14} />{opp.vacancies} vac.</span>}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">{opp.companyId?.companyName || ""}</span>
                <Link to={`/opportunities/${opp._id}`} className="text-indigo-600 text-sm font-medium hover:underline inline-flex items-center gap-1">
                  <Eye size={16} /> View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
