// src/pages/leads/LeadList.jsx
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
import { formatCurrency } from "../../utils/formatters";
import leadService from "../../services/leadService";

const LeadList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const response = await leadService.getLeadStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
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

  const statCards = stats
    ? [
        {
          label: "Total Leads",
          value: stats.totalLeads || 0,
          color: "from-purple-500 to-pink-500",
          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
        },
        {
          label: "Qualified",
          value: stats.statusCounts?.qualified || 0,
          color: "from-neon-green to-neon-blue",
          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        },
        {
          label: "Conversion Rate",
          value: `${stats.conversionRate || 0}%`,
          color: "from-amber-500 to-orange-500",
          icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
        },
        {
          label: "Total Value",
          value: formatCurrency(stats.totalValue || 0),
          color: "from-green-400 to-emerald-500",
          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        },
      ]
    : [];

  const hasFilters = filters.search || filters.status || filters.source;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Leads</h1>
          <p className="text-gray-500 mt-1">Manage your sales leads</p>
        </div>
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
      </div>

      <ErrorAlert message={error} onClose={() => setError("")} />

      <StatCards stats={statCards} />

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
