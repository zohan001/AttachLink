import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import { ArrowLeft, Edit, Send, XCircle } from "lucide-react";
import { getOpportunity, publishOpportunity, closeOpportunity, deleteOpportunity } from "../../api/opportunities";
import { createApplication } from "../../api/applications";
import Loading from "../../components/common/Loading";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useSelector((s) => s.auth);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const { data: opp, isLoading } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: () => getOpportunity(id),
  });

  const applyMutation = useMutation({
    mutationFn: () => createApplication({ opportunityId: id, coverLetter }),
    onSuccess: () => { toast.success("Application submitted"); qc.invalidateQueries({ queryKey: ["my-applications"] }); setShowApplyModal(false); setCoverLetter(""); },
    onError: (err) => handleApiError(err),
  });

  const publishMut = useMutation({
    mutationFn: () => publishOpportunity(id),
    onSuccess: () => { toast.success("Published"); qc.invalidateQueries({ queryKey: ["opportunity", id] }); },
    onError: (err) => handleApiError(err),
  });

  const closeMut = useMutation({
    mutationFn: () => closeOpportunity(id),
    onSuccess: () => { toast.success("Closed"); qc.invalidateQueries({ queryKey: ["opportunity", id] }); },
    onError: (err) => handleApiError(err),
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteOpportunity(id),
    onSuccess: () => { toast.success("Deleted"); navigate("/opportunities"); },
    onError: (err) => handleApiError(err),
  });

  if (isLoading) return <Loading />;
  if (!opp) return <p className="text-center py-12 text-gray-400">Not found</p>;

  const isOwner = opp.companyId?._id === user?.companyId || opp.companyId === user?.companyId;
  const canManage = isOwner || user?.role === "admin";

  return (
    <div className="max-w-3xl">
      <Link to="/opportunities" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{opp.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{opp.companyId?.companyName}</p>
          </div>
          <StatusBadge status={opp.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
          {opp.location && <div><span className="text-gray-400">Location</span><p>{opp.location}</p></div>}
          {opp.duration && <div><span className="text-gray-400">Duration</span><p>{opp.duration}</p></div>}
          {opp.stipend && <div><span className="text-gray-400">Stipend</span><p>{opp.stipend}</p></div>}
          {opp.vacancies && <div><span className="text-gray-400">Vacancies</span><p>{opp.vacancies}</p></div>}
          {opp.applicationDeadline && <div><span className="text-gray-400">Deadline</span><p>{new Date(opp.applicationDeadline).toLocaleDateString()}</p></div>}
          {opp.workMode && <div><span className="text-gray-400">Work Mode</span><p>{opp.workMode}</p></div>}
          {opp.category && <div><span className="text-gray-400">Category</span><p>{opp.category}</p></div>}
        </div>

        {opp.description && <div className="mb-6"><h4 className="font-medium text-gray-900 mb-1">Description</h4><p className="text-sm text-gray-600 whitespace-pre-wrap">{opp.description}</p></div>}
        {opp.requirements && <div className="mb-6"><h4 className="font-medium text-gray-900 mb-1">Requirements</h4><p className="text-sm text-gray-600 whitespace-pre-wrap">{opp.requirements}</p></div>}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          {user?.role === "student" && opp.status === "Open" && (
            <button onClick={() => setShowApplyModal(true)} disabled={applyMutation.isPending} className="btn-primary">
              {applyMutation.isPending ? "Applying..." : "Apply Now"}
            </button>
          )}
          {canManage && opp.status === "Draft" && (
            <button onClick={() => publishMut.mutate()} disabled={publishMut.isPending} className="btn-primary flex items-center gap-2">
              <Send size={16} /> Publish
            </button>
          )}
          {canManage && opp.status === "Open" && (
            <button onClick={() => closeMut.mutate()} disabled={closeMut.isPending} className="btn-secondary flex items-center gap-2">
              <XCircle size={16} /> Close
            </button>
          )}
          {canManage && (
            <>
              <Link to={`/opportunities/${id}/edit`} className="btn-secondary flex items-center gap-2"><Edit size={16} /> Edit</Link>
              {(user?.role === "admin" || opp.status === "Draft") && (
                <button onClick={() => { if (confirm("Delete this opportunity?")) deleteMut.mutate(); }} className="btn-danger flex items-center gap-2">Delete</button>
              )}
            </>
          )}
        </div>
      </div>

      <Modal open={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for this Opportunity">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              className="input w-full"
              placeholder="Tell the company why you're a good fit for this role (minimum 50 characters)..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowApplyModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending || coverLetter.length < 50} className="btn-primary">
              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
