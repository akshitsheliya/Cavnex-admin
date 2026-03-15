import React from "react";
import { useNavigate } from "react-router-dom";

const InvoiceCard = ({ invoice, onDelete, onDuplicate, onStatusChange }) => {
  const navigate = useNavigate();

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
      paid: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        border: "border-neon-green/30",
        label: "Paid",
      },
      partial: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/30",
        label: "Partial",
      },
      overdue: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
        label: "Overdue",
      },
      cancelled: {
        bg: "bg-gray-500/20",
        text: "text-gray-500",
        border: "border-gray-500/30",
        label: "Cancelled",
      },
    };
    return config[status] || config.draft;
  };

  const statusConfig = getStatusConfig(invoice.status);
  const isOverdue = invoice.status === "overdue";
  const isPaid = invoice.status === "paid";

  return (
    <div
      className={`glass-card p-6 hover:border-neon-green/30 transition-all cursor-pointer ${
        isOverdue ? "border-red-500/30" : ""
      }`}
      onClick={() => navigate(`/invoices/${invoice._id}`)}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">
              {isPaid ? "✅" : isOverdue ? "⚠️" : "📄"}
            </span>
            <h3 className="text-lg font-semibold text-white">
              {invoice.invoiceNumber}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span>
              {invoice.client?.businessName ||
                invoice.client?.clientName ||
                "No Client"}
            </span>
            <span>•</span>
            <span>Due: {formatDate(invoice.dueDate)}</span>
            <span>•</span>
            <span>{invoice.items?.length || 0} items</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-neon-green">
              {formatCurrency(invoice.total)}
            </p>
            {invoice.balanceDue > 0 && invoice.status !== "paid" && (
              <p className="text-sm text-amber-400">
                Due: {formatCurrency(invoice.balanceDue)}
              </p>
            )}
            {invoice.status === "paid" && (
              <p className="text-sm text-neon-green">Fully Paid</p>
            )}
          </div>

          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => navigate(`/invoices/${invoice._id}/edit`)}
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
              onClick={() => onDuplicate(invoice._id)}
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
            {invoice.status !== "paid" && (
              <button
                onClick={() => onDelete(invoice._id)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
