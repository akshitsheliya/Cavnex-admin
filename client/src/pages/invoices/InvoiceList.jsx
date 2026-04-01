// src/pages/invoices/InvoiceList.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import FilterBar from "../../components/common/FilterBar";
import StatCards from "../../components/common/StatCards";
import EmptyState from "../../components/common/EmptyState";
import ErrorAlert from "../../components/common/ErrorAlert";
import InvoiceCard from "../../components/invoices/InvoiceCard";
import { invoiceFilterConfig } from "../../config/filterConfigs";
import { formatCurrency } from "../../utils/formatters";
import invoiceService from "../../services/invoiceService";
import { getInvoiceStatCards } from "../../config/statCardConfigs";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "bank_transfer",
    paymentReference: "",
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page: pagination.current,
        limit: pagination.limit,
      };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await invoiceService.getInvoices(params);
      setInvoices(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, filters]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await invoiceService.getInvoiceStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "", startDate: "", endDate: "" });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleDelete = async () => {
    if (!selectedInvoice) return;
    try {
      await invoiceService.deleteInvoice(selectedInvoice._id);
      setShowDeleteModal(false);
      setSelectedInvoice(null);
      fetchInvoices();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete invoice");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await invoiceService.duplicateInvoice(id);
      fetchInvoices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to duplicate invoice");
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedInvoice || !paymentData.amount) return;
    try {
      await invoiceService.recordPayment(selectedInvoice._id, {
        amount: Number(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        paymentReference: paymentData.paymentReference,
      });
      setShowPaymentModal(false);
      setSelectedInvoice(null);
      setPaymentData({
        amount: "",
        paymentMethod: "bank_transfer",
        paymentReference: "",
      });
      fetchInvoices();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record payment");
    }
  };

  const handleSendInvoice = async (id) => {
    try {
      await invoiceService.sendInvoice(id);
      fetchInvoices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invoice");
    }
  };

  const paymentMethods = [
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "upi", label: "UPI" },
    { value: "cheque", label: "Cheque" },
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "other", label: "Other" },
  ];

  const statCards = getInvoiceStatCards(stats);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="text-gray-500 mt-1">
            Manage your invoices and payments
          </p>
        </div>
        <Button variant="neon" onClick={() => navigate("/invoices/new")}>
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
          Create Invoice
        </Button>
      </div>

      <ErrorAlert message={error} onClose={() => setError("")} />
      <StatCards stats={statCards} loading={statsLoading} columns={5} />

      <FilterBar
        searchPlaceholder="Search invoices..."
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        filterConfig={invoiceFilterConfig}
      />

      {loading ? (
        <Loader />
      ) : invoices.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No invoices found"
          description="Create your first invoice to get started"
          actionLabel="Create Invoice"
          onAction={() => navigate("/invoices/new")}
        />
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <InvoiceCard
              key={invoice._id}
              invoice={invoice}
              onDelete={(id) => {
                setSelectedInvoice(invoices.find((i) => i._id === id));
                setShowDeleteModal(true);
              }}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedInvoice(null);
        }}
        title="Delete Invoice"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete invoice "
            {selectedInvoice?.invoiceNumber}"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedInvoice(null);
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

      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedInvoice(null);
          setPaymentData({
            amount: "",
            paymentMethod: "bank_transfer",
            paymentReference: "",
          });
        }}
        title="Record Payment"
      >
        <div className="space-y-4">
          {selectedInvoice && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm">Invoice</span>
                <span className="text-white text-sm font-medium">
                  {selectedInvoice.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm">Total</span>
                <span className="text-white text-sm">
                  {formatCurrency(selectedInvoice.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Balance Due</span>
                <span className="text-amber-400 text-sm font-semibold">
                  {formatCurrency(selectedInvoice.balanceDue)}
                </span>
              </div>
            </div>
          )}

          <Input
            label="Amount (₹)"
            type="number"
            placeholder="Enter payment amount"
            value={paymentData.amount}
            onChange={(e) =>
              setPaymentData((prev) => ({ ...prev, amount: e.target.value }))
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Payment Method
            </label>
            <select
              value={paymentData.paymentMethod}
              onChange={(e) =>
                setPaymentData((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-neon-green/50 transition-all duration-300 [&>option]:bg-[#1a1a2e] [&>option]:text-white"
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Payment Reference (Optional)"
            placeholder="Transaction ID, cheque number, etc."
            value={paymentData.paymentReference}
            onChange={(e) =>
              setPaymentData((prev) => ({
                ...prev,
                paymentReference: e.target.value,
              }))
            }
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedInvoice(null);
                setPaymentData({
                  amount: "",
                  paymentMethod: "bank_transfer",
                  paymentReference: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="neon"
              className="flex-1"
              onClick={handleRecordPayment}
              disabled={!paymentData.amount}
            >
              Record Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceList;
