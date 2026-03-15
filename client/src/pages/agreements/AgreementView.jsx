import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import AgreementPreview from "../../components/agreements/AgreementPreview";
import agreementService from "../../services/agreementService";

const AgreementView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchAgreement();
  }, [id]);

  const fetchAgreement = async () => {
    try {
      setLoading(true);
      const response = await agreementService.getAgreement(id);
      setAgreement(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch agreement");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await agreementService.updateStatus(id, status);
      await fetchAgreement();
      setShowStatusModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
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
      signed: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        label: "Signed",
      },
      active: {
        bg: "bg-emerald-500/20",
        text: "text-emerald-400",
        label: "Active",
      },
      completed: {
        bg: "bg-cyan-500/20",
        text: "text-cyan-400",
        label: "Completed",
      },
      terminated: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Terminated",
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

  if (error || !agreement) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error || "Agreement not found"}</p>
        <Button onClick={() => navigate("/agreements")}>
          Back to Agreements
        </Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(agreement.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/agreements")}
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
            Back to Agreements
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{agreement.title}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <p className="text-gray-400 mt-1">{agreement.agreementNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowStatusModal(true)}>
            Change Status
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/agreements/${id}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Agreement Preview */}
      <AgreementPreview agreement={agreement} showActions={true} />

      {/* Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Agreement Status"
      >
        <div className="space-y-3">
          {[
            "draft",
            "sent",
            "viewed",
            "signed",
            "active",
            "completed",
            "terminated",
            "expired",
          ].map((status) => {
            const config = getStatusConfig(status);
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`w-full p-4 rounded-xl text-left transition-all border ${
                  agreement.status === status
                    ? `${config.bg} border-current ${config.text}`
                    : "bg-white/5 border-white/10 text-white hover:border-white/30"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default AgreementView;
