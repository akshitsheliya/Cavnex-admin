import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import proposalService from "../../services/proposalService";

const ProposalList = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.current,
        limit: pagination.limit,
      };

      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;

      const response = await proposalService.getProposals(params);
      setProposals(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, filters]);

  const fetchStats = async () => {
    try {
      const response = await proposalService.getProposalStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async () => {
    if (!selectedProposal) return;

    try {
      await proposalService.deleteProposal(selectedProposal._id);
      setShowDeleteModal(false);
      setSelectedProposal(null);
      fetchProposals();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete proposal");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await proposalService.duplicateProposal(id);
      fetchProposals();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to duplicate proposal");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await proposalService.updateStatus(id, status);
      fetchProposals();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    const config = {
      draft: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        border: "border-gray-500/30",
        label: "Draft",
      },
      sent: {
        bg: "bg-neon-blue/20",
        text: "text-neon-blue",
        border: "border-neon-blue/30",
        label: "Sent",
      },
      viewed: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        border: "border-purple-500/30",
        label: "Viewed",
      },
      accepted: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        border: "border-neon-green/30",
        label: "Accepted",
      },
      rejected: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
        label: "Rejected",
      },
      expired: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/30",
        label: "Expired",
      },
    };
    return config[status] || config.draft;
  };

  const statuses = [
    { value: "", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "viewed", label: "Viewed" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "expired", label: "Expired" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Proposals</h1>
          <p className="text-gray-400 mt-1">Manage your client proposals</p>
        </div>
        <Button variant="neon" onClick={() => navigate("/proposals/new")}>
          + Create Proposal
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {stats.totalProposals || 0}
            </p>
            <p className="text-sm text-gray-400">Total</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-400">
              {stats.statusCounts?.draft || 0}
            </p>
            <p className="text-sm text-gray-400">Drafts</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-blue">
              {stats.statusCounts?.sent || 0}
            </p>
            <p className="text-sm text-gray-400">Sent</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">
              {stats.statusCounts?.accepted || 0}
            </p>
            <p className="text-sm text-gray-400">Accepted</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">
              {formatCurrency(stats.totalAcceptedValue)}
            </p>
            <p className="text-sm text-gray-400">Total Value</p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search proposals..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              icon={
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Loader />
      ) : proposals.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No proposals found
          </h3>
          <p className="text-gray-400 mb-6">
            Create your first proposal to get started
          </p>
          <Button variant="neon" onClick={() => navigate("/proposals/new")}>
            Create Proposal
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const statusConfig = getStatusConfig(proposal.status);

            return (
              <Card
                key={proposal._id}
                className="p-6 hover:border-neon-green/30 transition-all cursor-pointer"
                onClick={() => navigate(`/proposals/${proposal._id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {proposal.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span>{proposal.proposalNumber}</span>
                      <span>•</span>
                      <span>
                        {proposal.client?.businessName ||
                          proposal.client?.clientName ||
                          "No Client"}
                      </span>
                      <span>•</span>
                      <span>Created {formatDate(proposal.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-neon-green">
                        {formatCurrency(proposal.pricing?.total)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Valid until {formatDate(proposal.validUntil)}
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          navigate(`/proposals/${proposal._id}/edit`)
                        }
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Edit"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDuplicate(proposal._id)}
                        className="p-2 text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors"
                        title="Duplicate"
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProposal(null);
        }}
        title="Delete Proposal"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete "{selectedProposal?.title}"? This
            action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedProposal(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="neon"
              className="flex-1 !bg-red-500 !shadow-red-500/25"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProposalList;
