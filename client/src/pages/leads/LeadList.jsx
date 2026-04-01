import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import FilterBar from "../../components/common/FilterBar";
import Pagination from "../../components/common/Pagination";
import StatCards from "../../components/common/StatCards";
import EmptyState from "../../components/common/EmptyState";
import ErrorAlert from "../../components/common/ErrorAlert";
import LeadCard from "../../components/leads/LeadCard";
import { leadFilterConfig } from "../../config/filterConfigs";
import { formatCurrency, getLeadStatCards } from "../../config/statCardConfigs";
import leadService from "../../services/leadService";
import PageHeader from "../../components/common/PageHeader";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
    setSelectedLeadId(leadId);
    setShowDeleteModal(true);
  };

  const handleConvertClick = (leadId) => {
    setSelectedLeadId(leadId);
    setShowConvertModal(true);
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await leadService.deleteLead(selectedLeadId);
      setLeads((prev) => prev.filter((l) => l._id !== selectedLeadId));
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete lead");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setSelectedLeadId(null);
    }
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
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        subtitle="Manage your sales leads"
        onRefresh={handleRefresh}
        refreshing={refreshing}
      >
        <Button variant="neon" onClick={() => navigate("/leads/new")}>
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
          Add Lead
        </Button>
      </PageHeader>

      <ErrorAlert message={error} onClose={() => setError("")} />

      <StatCards stats={statCards} loading={statsLoading} columns={4} />

      <FilterBar
        searchPlaceholder="Search leads..."
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        filterConfig={leadFilterConfig}
      />

      {loading ? (
        <Loader />
      ) : leads.length === 0 ? (
        <EmptyState
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      {stats && (
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Lead Analytics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Total Leads
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {stats.totalLeads}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Qualified
              </p>
              <p className="text-2xl font-bold text-neon-green mt-1">
                {stats.statusCounts?.contacted || 0}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Conversion Rate
              </p>
              <p className="text-2xl font-bold text-amber-400 mt-1">
                {stats.conversionRate}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Total Value
              </p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-white mb-3">
              Leads by Platform
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(stats.sourceCounts || {}).map(
                ([source, count]) => (
                  <div
                    key={source}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 text-center"
                  >
                    <p className="text-xs text-gray-400 capitalize">
                      {source.replace("_", " ")}
                    </p>
                    <p className="text-lg font-bold text-white mt-1">{count}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Lead"
      >
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this lead? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={actionLoading}
          >
            Delete Lead
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        title="Convert to Client"
      >
        <p className="text-gray-300 mb-4">
          Are you sure you want to convert this lead to a client?
        </p>
        <p className="text-gray-500 text-sm mb-6">
          This will create a new client record and mark this lead as "Won".
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowConvertModal(false)}>
            Cancel
          </Button>
          <Button
            variant="neon"
            onClick={handleConvert}
            loading={actionLoading}
          >
            Convert to Client
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LeadList;
