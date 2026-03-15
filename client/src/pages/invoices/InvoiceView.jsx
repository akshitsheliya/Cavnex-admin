import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import InvoicePreview from "../../components/invoices/InvoicePreview";
import invoiceService from "../../services/invoiceService";

const InvoiceView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "bank_transfer",
    paymentReference: "",
  });

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getInvoice(id);
      setInvoice(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await invoiceService.updateStatus(id, status);
      await fetchInvoice();
      setShowStatusModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleSendInvoice = async () => {
    try {
      await invoiceService.sendInvoice(id);
      await fetchInvoice();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invoice");
    }
  };

  const handleRecordPayment = async () => {
    if (!paymentData.amount) return;

    try {
      await invoiceService.recordPayment(id, {
        amount: Number(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        paymentReference: paymentData.paymentReference,
      });
      await fetchInvoice();
      setShowPaymentModal(false);
      setPaymentData({
        amount: "",
        paymentMethod: "bank_transfer",
        paymentReference: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record payment");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
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
      paid: { bg: "bg-neon-green/20", text: "text-neon-green", label: "Paid" },
      partial: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        label: "Partial",
      },
      overdue: { bg: "bg-red-500/20", text: "text-red-400", label: "Overdue" },
      cancelled: {
        bg: "bg-gray-500/20",
        text: "text-gray-500",
        label: "Cancelled",
      },
    };
    return config[status] || config.draft;
  };

  const paymentMethods = [
    { id: "bank_transfer", label: "Bank Transfer" },
    { id: "upi", label: "UPI" },
    { id: "cheque", label: "Cheque" },
    { id: "cash", label: "Cash" },
    { id: "card", label: "Card" },
    { id: "other", label: "Other" },
  ];

  if (loading) {
    return <Loader />;
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error || "Invoice not found"}</p>
        <Button onClick={() => navigate("/invoices")}>Back to Invoices</Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(invoice.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/invoices")}
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
            Back to Invoices
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">
              {invoice.invoiceNumber}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <p className="text-gray-400 mt-1">
            {invoice.client?.businessName || invoice.client?.clientName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {invoice.status === "draft" && (
            <Button variant="outline" onClick={handleSendInvoice}>
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Send Invoice
            </Button>
          )}
          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <Button
              variant="neon"
              onClick={() => {
                setPaymentData((prev) => ({
                  ...prev,
                  amount: String(invoice.balanceDue),
                }));
                setShowPaymentModal(true);
              }}
            >
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
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Record Payment
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowStatusModal(true)}>
            Change Status
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/invoices/${id}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Payment Summary for partial/overdue */}
      {(invoice.status === "partial" || invoice.status === "overdue") && (
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-xl font-bold text-white">
              {formatCurrency(invoice.total)}
            </p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-gray-400">Paid</p>
            <p className="text-xl font-bold text-neon-green">
              {formatCurrency(invoice.amountPaid)}
            </p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-gray-400">Balance Due</p>
            <p className="text-xl font-bold text-amber-400">
              {formatCurrency(invoice.balanceDue)}
            </p>
          </div>
        </div>
      )}

      {/* Invoice Preview */}
      <InvoicePreview invoice={invoice} showActions={true} />

      {/* Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Invoice Status"
      >
        <div className="space-y-3">
          {[
            "draft",
            "sent",
            "viewed",
            "paid",
            "partial",
            "overdue",
            "cancelled",
          ].map((status) => {
            const config = getStatusConfig(status);
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`w-full p-4 rounded-xl text-left transition-all border ${
                  invoice.status === status
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

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentData({
            amount: "",
            paymentMethod: "bank_transfer",
            paymentReference: "",
          });
        }}
        title="Record Payment"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Total</span>
              <span className="text-white">
                {formatCurrency(invoice.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Balance Due</span>
              <span className="text-amber-400 font-semibold">
                {formatCurrency(invoice.balanceDue)}
              </span>
            </div>
          </div>

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

export default InvoiceView;
