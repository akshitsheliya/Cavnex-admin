import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import ProposalPreview from "../../components/proposals/ProposalPreview";
import proposalService from "../../services/proposalService";

const ProposalView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const response = await proposalService.getProposal(id);
      setProposal(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch proposal");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await proposalService.updateStatus(id, status);
      await fetchProposal();
      setShowStatusModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDownloadPDF = () => {
    // PDF generation will be implemented
    alert("PDF Download - Coming Soon!");
  };

  const handleSendProposal = async () => {
    await handleStatusChange("sent");
  };

  const getStatusConfig = (status) => {
    const config = {
      draft: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Draft" },
      sent: { bg: "bg-neon-blue/20", text: "text-neon-blue", label: "Sent" },
      viewed: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        label: "Viewed",
      },
      accepted: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        label: "Accepted",
      },
      rejected: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Rejected",
      },
      expired: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        label: "Expired",
      },
    };
    return config[status] || config.draft;
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !proposal) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error || "Proposal not found"}</p>
        <Button onClick={() => navigate("/proposals")}>
          Back to Proposals
        </Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(proposal.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/proposals")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Proposals
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{proposal.title}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <p className="text-gray-400 mt-1">{proposal.proposalNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowStatusModal(true)}>
            Change Status
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/proposals/${id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="neon" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Proposal Preview */}
      <ProposalPreview
        proposal={proposal}
        onDownloadPDF={handleDownloadPDF}
        onSendProposal={handleSendProposal}
      />

      {/* Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Proposal Status"
      >
        <div className="space-y-3">
          {["draft", "sent", "viewed", "accepted", "rejected", "expired"].map(
            (status) => {
              const config = getStatusConfig(status);
              return (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    proposal.status === status
                      ? `${config.bg} border-current ${config.text}`
                      : "bg-white/5 border-white/10 text-white hover:border-white/30"
                  }`}
                >
                  {config.label}
                </button>
              );
            }
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProposalView;
