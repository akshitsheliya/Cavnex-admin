// LeadDetail.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import LeadStatusBadge from "../../components/leads/LeadStatusBadge";
import leadService from "../../services/leadService";

const { confirm } = Modal;

const InfoField = ({ label, children }) => (
  <div className="min-w-0">
    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
      {label}
    </p>
    <div className="text-white text-xs sm:text-sm lg:text-base break-words">
      {children}
    </div>
  </div>
);

const quickActionBase =
  "flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 w-full text-left text-xs sm:text-sm";

const LeadDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLead(id);
      setLead(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lead");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    confirm({
      title: "Delete Lead",
      icon: <ExclamationCircleOutlined />,
      content: (
        <span>
          Are you sure you want to delete{" "}
          <strong className="text-white">{lead?.leadName}</strong>? This action
          cannot be undone.
        </span>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      className: "custom-confirm-modal",
      async onOk() {
        try {
          await leadService.deleteLead(id);
          message.success("Lead deleted successfully");
          navigate("/leads");
        } catch (err) {
          setError(err.response?.data?.message || "Failed to delete lead");
        }
      },
    });
  };

  const handleConvert = async () => {
    try {
      setActionLoading(true);
      await leadService.convertToClient(id);
      message.success("Lead converted to client successfully");
      navigate("/clients");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to convert lead");
    } finally {
      setActionLoading(false);
      setShowConvertModal(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await leadService.updateLeadStatus(id, newStatus);
      setLead((prev) => ({ ...prev, status: newStatus }));
      message.success("Status updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (loading) return <Loader />;

  if (error && !lead) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <p className="text-red-400 mb-4 text-xs sm:text-sm lg:text-base">
          {error}
        </p>
        <Button variant="outline" onClick={() => navigate("/leads")}>
          Back to Leads
        </Button>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <p className="text-gray-400 mb-4 text-sm">Lead not found</p>
        <Button variant="outline" onClick={() => navigate("/leads")}>
          Back to Leads
        </Button>
      </div>
    );
  }

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "meeting", label: "Meeting" },
    { value: "proposal_sent", label: "Proposal Sent" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed_won", label: "Won" },
    { value: "closed_lost", label: "Lost" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 lg:space-y-6 px-2 sm:px-0">
      {/* Back button */}
      <button
        onClick={() => navigate("/leads")}
        className="flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform flex-shrink-0"
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
        <span className="text-xs sm:text-sm">Back to Leads</span>
      </button>

      {/* Error Banner */}
      {error && (
        <div className="p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 sm:gap-3">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-400 text-xs sm:text-sm leading-relaxed">
            {error}
          </p>
        </div>
      )}

      {/* Hero Card */}
      <div className="glass-card p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Avatar + name + status */}
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {lead.leadName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                {lead.leadName}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm truncate">
                {lead.businessName || "No business name"}
              </p>
              <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <LeadStatusBadge status={lead.status} size="md" />
                {lead.convertedToClient && (
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-neon-blue/20 text-neon-blue border border-neon-blue/30 whitespace-nowrap">
                    Converted
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t border-white/10 sm:border-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/leads/${id}/edit`)}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 flex-shrink-0"
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
              Edit
            </Button>

            {!lead.convertedToClient && lead.status !== "closed_won" && (
              <Button
                variant="neon"
                size="sm"
                onClick={() => setShowConvertModal(true)}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Convert
              </Button>
            )}

            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteClick}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 flex-shrink-0"
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
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {/* Left column: info cards */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Contact Information */}
          <Card title="Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              <InfoField label="Email">
                <a
                  href={`mailto:${lead.email}`}
                  className="text-white hover:text-neon-green transition-colors break-all"
                >
                  {lead.email}
                </a>
              </InfoField>

              <InfoField label="Phone">
                <a
                  href={`tel:${lead.phone}`}
                  className="text-white hover:text-neon-green transition-colors"
                >
                  {lead.phone}
                </a>
              </InfoField>

              <InfoField label="City">
                <span>{lead.city || "Not specified"}</span>
              </InfoField>

              <InfoField label="Business Type">
                <span>{lead.businessType || "Not specified"}</span>
              </InfoField>
            </div>
          </Card>

          {/* Lead Details */}
          <Card title="Lead Details">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              <InfoField label="Source">
                <span className="capitalize">
                  {lead.source?.replace("_", " ")}
                </span>
              </InfoField>

              <InfoField label="Estimated Value">
                <span className="text-neon-green font-semibold">
                  {lead.estimatedValue > 0
                    ? formatCurrency(lead.estimatedValue)
                    : "Not specified"}
                </span>
              </InfoField>

              <InfoField label="Created">
                <span>{formatDate(lead.createdAt)}</span>
              </InfoField>

              <InfoField label="Follow-up Date">
                <span>
                  {lead.followUpDate
                    ? formatDate(lead.followUpDate)
                    : "Not set"}
                </span>
              </InfoField>

              <InfoField label="Last Updated">
                <span>{formatDate(lead.updatedAt)}</span>
              </InfoField>
            </div>

            {lead.notes && (
              <div className="mt-4 sm:mt-5 lg:mt-6 pt-4 sm:pt-5 lg:pt-6 border-t border-white/10">
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Notes
                </p>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {lead.notes}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right column: status + quick actions */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Update Status */}
          <Card title="Update Status">
            <div className="space-y-1.5 sm:space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  disabled={lead.convertedToClient}
                  className={`w-full p-2.5 sm:p-3 rounded-xl text-left transition-all duration-200 text-xs sm:text-sm ${
                    lead.status === option.value
                      ? "bg-neon-green/10 border border-neon-green/30 text-neon-green"
                      : "bg-white/[0.02] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white"
                  } ${
                    lead.convertedToClient
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{option.label}</span>
                    {lead.status === option.value && (
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2 sm:space-y-2.5">
              <a href={`mailto:${lead.email}`} className={quickActionBase}>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="truncate">Send Email</span>
              </a>

              <a href={`tel:${lead.phone}`} className={quickActionBase}>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="truncate">Call Now</span>
              </a>

              <a
                href={`https://wa.me/91${lead.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className={quickActionBase}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="truncate">WhatsApp</span>
              </a>

              <button
                onClick={() =>
                  navigate("/proposals/new", {
                    state: { leadId: lead._id, leadName: lead.leadName },
                  })
                }
                className={quickActionBase}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="truncate">Create Proposal</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Convert Modal */}
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
          Are you sure you want to convert{" "}
          <span className="text-white font-medium">{lead.leadName}</span> to a
          client?
        </p>
        <p className="text-gray-400 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">
          This will create a new client record with the lead's information and
          mark this lead as "Won".
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
      `}</style>
    </div>
  );
};

export default LeadDetail;
