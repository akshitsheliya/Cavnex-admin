// src/pages/proposals/ProposalList.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import FilterBar from "../../components/common/FilterBar";
import StatCards from "../../components/common/StatCards";
import EmptyState from "../../components/common/EmptyState";
import ErrorAlert from "../../components/common/ErrorAlert";
import { proposalFilterConfig } from "../../config/filterConfigs";
import { formatCurrency, formatDate } from "../../utils/formatters";
import proposalService from "../../services/proposalService";
import { getProposalStatCards } from "../../config/statCardConfigs";
import PageHeader from "../../components/common/PageHeader";
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

const ProposalCard = ({ proposal, onEdit, onDuplicate, onDelete }) => {
  const statusConfig = getStatusConfig(proposal.status);

  return (
    <div
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-neon-green/30 transition-all duration-500 cursor-pointer overflow-hidden"
      onClick={() => onEdit(proposal._id, false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            📋
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h3 className="text-base font-semibold text-white truncate">
                {proposal.title}
              </h3>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span className="font-mono text-xs">
                {proposal.proposalNumber}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>
                {proposal.client?.businessName ||
                  proposal.client?.clientName ||
                  "No Client"}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>Created {formatDate(proposal.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-lg font-bold bg-gradient-to-r from-neon-green to-emerald-400 bg-clip-text text-transparent">
              {formatCurrency(proposal.pricing?.total)}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Valid until {formatDate(proposal.validUntil)}
            </p>
          </div>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(proposal._id, true)}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              title="Edit"
            >
              <svg
                className="w-4.5 h-4.5"
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
              onClick={() => onDuplicate(proposal._id)}
              className="p-2 rounded-lg text-gray-500 hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-200"
              title="Duplicate"
            >
              <svg
                className="w-4.5 h-4.5"
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
              onClick={() => onDelete(proposal)}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              title="Delete"
            >
              <svg
                className="w-4.5 h-4.5"
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
    </div>
  );
};

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
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      setStatsLoading(true);
      const response = await proposalService.getProposalStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProposals(), fetchStats()]);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "" });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

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

  const handleEdit = (id, isEdit) => {
    if (isEdit) {
      navigate(`/proposals/${id}/edit`);
    } else {
      navigate(`/proposals/${id}`);
    }
  };

  const handleDeleteClick = (proposal) => {
    setSelectedProposal(proposal);
    setShowDeleteModal(true);
  };

  const statCards = getProposalStatCards(stats);

  const hasFilters = filters.search || filters.status;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proposals"
        subtitle="Manage your client proposals"
        onRefresh={handleRefresh}
        refreshing={refreshing}
      >
        <Button variant="neon" onClick={() => navigate("/proposals/new")}>
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Proposal
        </Button>
      </PageHeader>

      <ErrorAlert message={error} onClose={() => setError("")} />

      <StatCards stats={statCards} loading={statsLoading} columns={5} />

      <FilterBar
        searchPlaceholder="Search proposals..."
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        filterConfig={proposalFilterConfig}
      />

      {loading ? (
        <Loader />
      ) : proposals.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No proposals found"
          description={
            hasFilters
              ? "Try adjusting your filters"
              : "Create your first proposal to get started"
          }
          actionLabel={hasFilters ? undefined : "Create Proposal"}
          onAction={hasFilters ? undefined : () => navigate("/proposals/new")}
        />
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal._id}
              proposal={proposal}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

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
            <Button variant="danger" className="flex-1" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProposalList;
