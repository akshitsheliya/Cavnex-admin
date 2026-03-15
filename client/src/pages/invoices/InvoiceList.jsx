import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import InvoiceCard from "../../components/invoices/InvoiceCard";
import InvoiceFilters from "../../components/invoices/InvoiceFilters";
import invoiceService from "../../services/invoiceService";

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
      const response = await invoiceService.getInvoiceStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
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
    setFilters({
      search: "",
      status: "",
      startDate: "",
      endDate: "",
    });
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const paymentMethods = [
    { id: "bank_transfer", label: "Bank Transfer" },
    { id: "upi", label: "UPI" },
    { id: "cheque", label: "Cheque" },
    { id: "cash", label: "Cash" },
    { id: "card", label: "Card" },
    { id: "other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="text-gray-400 mt-1">
            Manage your invoices and payments
          </p>
        </div>
        <Button variant="neon" onClick={() => navigate("/invoices/new")}>
          + Create Invoice
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {stats.totalInvoices || 0}
            </p>
            <p className="text-sm text-gray-400">Total Invoices</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">
              {formatCurrency(stats.totalAmount)}
            </p>
            <p className="text-sm text-gray-400">Total Amount</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-blue">
              {formatCurrency(stats.totalPaid)}
            </p>
            <p className="text-sm text-gray-400">Received</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">
              {formatCurrency(stats.totalPending)}
            </p>
            <p className="text-sm text-gray-400">Pending</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">
              {stats.statusCounts?.overdue || 0}
            </p>
            <p className="text-sm text-gray-400">Overdue</p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <InvoiceFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Loader />
      ) : invoices.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No invoices found
          </h3>
          <p className="text-gray-400 mb-6">
            Create your first invoice to get started
          </p>
          <Button variant="neon" onClick={() => navigate("/invoices/new")}>
            Create Invoice
          </Button>
        </Card>
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

      {/* Delete Modal */}
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

      {/* Payment Modal */}
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
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Invoice</span>
                <span className="text-white">
                  {selectedInvoice.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total</span>
                <span className="text-white">
                  {formatCurrency(selectedInvoice.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Balance Due</span>
                <span className="text-amber-400 font-semibold">
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
            >
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
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
