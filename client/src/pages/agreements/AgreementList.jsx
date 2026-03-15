import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import agreementService from "../../services/agreementService";

const AgreementList = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);

  const fetchAgreements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.current,
        limit: pagination.limit,
      };

      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;

      const response = await agreementService.getAgreements(params);
      setAgreements(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch agreements");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, filters]);

  const fetchStats = async () => {
    try {
      const response = await agreementService.getAgreementStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, [fetchAgreements]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async () => {
    if (!selectedAgreement) return;

    try {
      await agreementService.deleteAgreement(selectedAgreement._id);
      setShowDeleteModal(false);
      setSelectedAgreement(null);
      fetchAgreements();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete agreement");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await agreementService.duplicateAgreement(id);
      fetchAgreements();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to duplicate agreement");
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
      signed: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        border: "border-neon-green/30",
        label: "Signed",
      },
      active: {
        bg: "bg-emerald-500/20",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        label: "Active",
      },
      completed: {
        bg: "bg-cyan-500/20",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
        label: "Completed",
      },
      terminated: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
        label: "Terminated",
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

  const getTypeIcon = (type) => {
    const icons = {
      software_development: "💻",
      maintenance: "🔧",
      consulting: "💼",
      nda: "🔒",
      custom: "📝",
    };
    return icons[type] || "📄";
  };

  const statuses = [
    { value: "", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "signed", label: "Signed" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "terminated", label: "Terminated" },
  ];

  const types = [
    { value: "", label: "All Types" },
    { value: "software_development", label: "Software Development" },
    { value: "maintenance", label: "Maintenance" },
    { value: "consulting", label: "Consulting" },
    { value: "nda", label: "NDA" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Agreements</h1>
          <p className="text-gray-400 mt-1">Manage your client agreements</p>
        </div>
        <Button variant="neon" onClick={() => navigate("/agreements/new")}>
          + Create Agreement
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {stats.totalAgreements || 0}
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
              {stats.statusCounts?.signed || 0}
            </p>
            <p className="text-sm text-gray-400">Signed</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">
              {formatCurrency(stats.totalContractValue)}
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
              placeholder="Search agreements..."
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
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
          >
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
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
      ) : agreements.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No agreements found
          </h3>
          <p className="text-gray-400 mb-6">
            Create your first agreement to get started
          </p>
          <Button variant="neon" onClick={() => navigate("/agreements/new")}>
            Create Agreement
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {agreements.map((agreement) => {
            const statusConfig = getStatusConfig(agreement.status);

            return (
              <Card
                key={agreement._id}
                className="p-6 hover:border-neon-green/30 transition-all cursor-pointer"
                onClick={() => navigate(`/agreements/${agreement._id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      {getTypeIcon(agreement.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {agreement.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span>{agreement.agreementNumber}</span>
                        <span>•</span>
                        <span>
                          {agreement.dynamicFields?.clientName ||
                            agreement.client?.clientName ||
                            "No Client"}
                        </span>
                        <span>•</span>
                        <span>
                          {agreement.dynamicFields?.projectName || "No Project"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-neon-green">
                        {formatCurrency(agreement.dynamicFields?.price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created {formatDate(agreement.createdAt)}
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          navigate(`/agreements/${agreement._id}/edit`)
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
                        onClick={() => handleDuplicate(agreement._id)}
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
                          setSelectedAgreement(agreement);
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
          setSelectedAgreement(null);
        }}
        title="Delete Agreement"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete "{selectedAgreement?.title}"? This
            action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedAgreement(null);
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

export default AgreementList;
