// src/pages/clients/ClientList.jsx
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
import ClientCard from "../../components/clients/ClientCard";
import { clientFilterConfig } from "../../config/filterConfigs";
import { formatCurrency } from "../../utils/formatters";
import clientService from "../../services/clientService";
import { getClientStatCards } from "../../config/statCardConfigs";
import PageHeader from "../../components/common/PageHeader";

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
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
    industry: "",
  });
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fetchClients = useCallback(async () => {
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
      const response = await clientService.getClients(params);
      setClients(response.data);
      setPagination((prev) => ({ ...prev, ...response.pagination }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.limit, filters]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await clientService.getClientStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchClients(), fetchStats()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "", industry: "" });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleDeleteClick = (clientId) => {
    setSelectedClientId(clientId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await clientService.deleteClient(selectedClientId);
      setClients((prev) => prev.filter((c) => c._id !== selectedClientId));
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete client");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setSelectedClientId(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current: newPage }));
  };

  const statCards = getClientStatCards(stats);

  const hasFilters = filters.search || filters.status || filters.industry;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="Manage your client relationships"
        onRefresh={handleRefresh}
        refreshing={refreshing}
      >
        <Button variant="neon" onClick={() => navigate("/clients/new")}>
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
          Add Client
        </Button>
      </PageHeader>
      <ErrorAlert message={error} onClose={() => setError("")} />
      <StatCards stats={statCards} loading={statsLoading} columns={4} />
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <FilterBar
            searchPlaceholder="Search clients..."
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            filterConfig={clientFilterConfig}
          />
        </div>
        <div className="flex items-center gap-1 mt-[52px] p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-lg transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-neon-green/20 text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.15)]"
                : "text-gray-500 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-lg transition-all duration-300 ${
              viewMode === "list"
                ? "bg-neon-green/20 text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.15)]"
                : "text-gray-500 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : clients.length === 0 ? (
        <EmptyState
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          title="No clients found"
          description={
            hasFilters
              ? "Try adjusting your filters"
              : "Get started by adding your first client"
          }
          actionLabel={hasFilters ? undefined : "Add Your First Client"}
          onAction={hasFilters ? undefined : () => navigate("/clients/new")}
        />
      ) : (
        <>
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {clients.map((client) => (
              <ClientCard
                key={client._id}
                client={client}
                onDelete={handleDeleteClick}
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
        title="Delete Client"
      >
        <p className="text-gray-300 mb-4">
          Are you sure you want to delete this client?
        </p>
        <p className="text-gray-500 text-sm mb-6">
          This will also affect all associated projects, invoices, and
          proposals. This action cannot be undone.
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
            Delete Client
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ClientList;
