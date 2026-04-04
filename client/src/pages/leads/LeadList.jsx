// LeadList.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Select, Input } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import StatCards from "../../components/common/StatCards";
import EmptyState from "../../components/common/EmptyState";
import ErrorAlert from "../../components/common/ErrorAlert";
import LeadCard from "../../components/leads/LeadCard";
import { formatCurrency, getLeadStatCards } from "../../config/statCardConfigs";
import leadService from "../../services/leadService";

const { Option } = Select;
const { confirm } = Modal;

const LeadList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    source: "",
  });
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "meeting", label: "Meeting" },
    { value: "proposal_sent", label: "Proposal Sent" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed_won", label: "Won" },
    { value: "closed_lost", label: "Lost" },
  ];

  const sourceOptions = [
    { value: "", label: "All Sources" },
    { value: "website", label: "Website" },
    { value: "instagram", label: "Instagram" },
    { value: "referral", label: "Referral" },
    { value: "google", label: "Google" },
    { value: "cold_call", label: "Cold Call" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "other", label: "Other" },
  ];

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        ...filters,
      };
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });
      const response = await leadService.getLeads(params);
      setLeads(response.data);
      setPagination((prev) => ({ ...prev, ...response.pagination }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.limit, filters]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await leadService.getLeadStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchLeads(), fetchStats()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "", source: "" });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleDeleteClick = (leadId) => {
    confirm({
      title: "Delete Lead",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this lead? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      className: "custom-confirm-modal",
      async onOk() {
        try {
          await leadService.deleteLead(leadId);
          setLeads((prev) => prev.filter((l) => l._id !== leadId));
          fetchStats();
        } catch (err) {
          setError(err.response?.data?.message || "Failed to delete lead");
        }
      },
    });
  };

  const handleConvertClick = (leadId) => {
    setSelectedLeadId(leadId);
    setShowConvertModal(true);
  };

  const handleConvert = async () => {
    try {
      setActionLoading(true);
      await leadService.convertToClient(selectedLeadId);
      fetchLeads();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to convert lead");
    } finally {
      setActionLoading(false);
      setShowConvertModal(false);
      setSelectedLeadId(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current: newPage }));
  };

  const statCards = getLeadStatCards(stats);
  const hasFilters = filters.search || filters.status || filters.source;

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 px-2 sm:px-0">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
            Leads
          </h1>
          <p className="text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-sm">
            Manage your sales leads
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-2 sm:p-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-neon-green/30 transition-all duration-200 ${
              refreshing ? "animate-spin" : ""
            }`}
            title="Refresh"
          >
            <ReloadOutlined className="text-sm sm:text-base" />
          </button>
          <Button
            variant="neon"
            onClick={() => navigate("/leads/new")}
            className="whitespace-nowrap text-xs sm:text-sm"
          >
            <PlusOutlined className="mr-1 sm:mr-1.5" />
            <span className="hidden xs:inline">Add Lead</span>
            <span className="xs:hidden">Add</span>
          </Button>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError("")} />

      {/* Stat Cards */}
      <StatCards stats={statCards} loading={statsLoading} columns={4} />

      {/* Filter Bar */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search leads..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="custom-search-input w-full"
              allowClear
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select
              value={filters.status || undefined}
              onChange={(value) => handleFilterChange("status", value || "")}
              placeholder="All Status"
              allowClear
              className="custom-filter-select w-full sm:w-36 lg:w-40"
              popupClassName="custom-dropdown"
            >
              {statusOptions.slice(1).map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
            <Select
              value={filters.source || undefined}
              onChange={(value) => handleFilterChange("source", value || "")}
              placeholder="All Sources"
              allowClear
              className="custom-filter-select w-full sm:w-36 lg:w-40"
              popupClassName="custom-dropdown"
            >
              {sourceOptions.slice(1).map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
            <button
              onClick={handleResetFilters}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Lead Grid / Empty State */}
      {loading ? (
        <Loader />
      ) : leads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description={
            hasFilters
              ? "Try adjusting your filters"
              : "Get started by adding your first lead"
          }
          actionLabel={hasFilters ? undefined : "Add Your First Lead"}
          onAction={hasFilters ? undefined : () => navigate("/leads/new")}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onDelete={handleDeleteClick}
                onConvert={handleConvertClick}
              />
            ))}
          </div>
          <Pagination
            currentPage={pagination.current}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Analytics Section */}
      {stats && (
        <div className="glass-card p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-3 sm:mb-4">
            Lead Analytics
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider truncate">
                Total Leads
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white mt-0.5 sm:mt-1">
                {stats.totalLeads}
              </p>
            </div>
            <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider truncate">
                Qualified
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-neon-green mt-0.5 sm:mt-1">
                {stats.statusCounts?.contacted || 0}
              </p>
            </div>
            <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider truncate">
                Conversion Rate
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400 mt-0.5 sm:mt-1">
                {stats.conversionRate}%
              </p>
            </div>
            <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider truncate">
                Total Value
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 mt-0.5 sm:mt-1 truncate">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </div>

          {Object.keys(stats.sourceCounts || {}).length > 0 && (
            <div className="mt-4 sm:mt-5 lg:mt-6">
              <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">
                Leads by Platform
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {Object.entries(stats.sourceCounts || {}).map(
                  ([source, count]) => (
                    <div
                      key={source}
                      className="p-2 sm:p-2.5 lg:p-3 rounded-lg bg-white/5 border border-white/10 text-center"
                    >
                      <p className="text-[10px] sm:text-xs text-gray-400 capitalize truncate">
                        {source.replace("_", " ")}
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-white mt-0.5 sm:mt-1">
                        {count}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Convert to Client Modal */}
      <Modal
        open={showConvertModal}
        onCancel={() => setShowConvertModal(false)}
        title={<span className="text-white">Convert to Client</span>}
        footer={null}
        className="custom-modal"
        centered
        width={400}
      >
        <p className="text-gray-300 mb-3 text-sm sm:text-base leading-relaxed">
          Are you sure you want to convert this lead to a client?
        </p>
        <p className="text-gray-500 text-xs sm:text-sm mb-5 sm:mb-6">
          This will create a new client record and mark this lead as "Won".
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowConvertModal(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="neon"
            onClick={handleConvert}
            loading={actionLoading}
            className="w-full sm:w-auto"
          >
            Convert to Client
          </Button>
        </div>
      </Modal>

      <style jsx global>{`
        .custom-search-input {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          height: 2.5rem !important;
        }
        .custom-search-input .ant-input {
          background: transparent !important;
          color: white !important;
        }
        .custom-search-input .ant-input::placeholder {
          color: #6b7280 !important;
        }
        .custom-search-input:hover,
        .custom-search-input:focus-within {
          border-color: rgba(0, 255, 136, 0.5) !important;
        }
        .custom-filter-select .ant-select-selector {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          height: 2.5rem !important;
        }
        .custom-filter-select .ant-select-selection-item,
        .custom-filter-select .ant-select-selection-placeholder {
          line-height: 2.5rem !important;
          color: white !important;
        }
        .custom-filter-select .ant-select-selection-placeholder {
          color: #9ca3af !important;
        }
        .custom-filter-select:hover .ant-select-selector {
          border-color: rgba(0, 255, 136, 0.5) !important;
        }
        .custom-filter-select .ant-select-arrow,
        .custom-filter-select .ant-select-clear {
          color: #9ca3af !important;
        }
        .custom-dropdown {
          background: #1a1a2e !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
        }
        .custom-dropdown .ant-select-item {
          color: white !important;
        }
        .custom-dropdown .ant-select-item-option-active,
        .custom-dropdown .ant-select-item-option-selected {
          background: rgba(0, 255, 136, 0.1) !important;
        }
        .custom-modal .ant-modal-content {
          background: #1a1a2e !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
        }
        .custom-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .custom-modal .ant-modal-title {
          color: white !important;
        }
        .custom-modal .ant-modal-close-x {
          color: #9ca3af !important;
        }
        .custom-confirm-modal .ant-modal-content {
          background: #1a1a2e !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
        }
        .custom-confirm-modal .ant-modal-confirm-title,
        .custom-confirm-modal .ant-modal-confirm-content {
          color: white !important;
        }
        .custom-confirm-modal .ant-btn-default {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LeadList;
