import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import ClientProjects from "../../components/clients/ClientProjects";
import clientService from "../../services/clientService";

const InfoField = ({ label, children }) => (
  <div className="min-w-0">
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
      {label}
    </p>
    <div className="break-words overflow-hidden">{children}</div>
  </div>
);

const QuickActionLink = ({ href, icon, label, onClick, isButton = false }) => {
  const className =
    "w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white transition-all";

  if (isButton) {
    return (
      <button onClick={onClick} className={className}>
        {icon}
        <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <a
      href={href}
      target={href?.startsWith("https") ? "_blank" : undefined}
      rel={href?.startsWith("https") ? "noopener noreferrer" : undefined}
      className={className}
    >
      {icon}
      <span className="truncate">{label}</span>
    </a>
  );
};

const ClientDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchClient();
    fetchRelatedData();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await clientService.getClient(id);
      setClient(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch client");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    try {
      const [projectsRes, invoicesRes, proposalsRes] = await Promise.allSettled(
        [
          clientService.getClientProjects(id),
          clientService.getClientInvoices(id),
          clientService.getClientProposals(id),
        ]
      );

      if (projectsRes.status === "fulfilled") {
        setProjects(projectsRes.value.data || []);
      }
      if (invoicesRes.status === "fulfilled") {
        setInvoices(invoicesRes.value.data || []);
      }
      if (proposalsRes.status === "fulfilled") {
        setProposals(proposalsRes.value.data || []);
      }
    } catch (err) {
      console.error("Error fetching related data:", err);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await clientService.deleteClient(id);
      navigate("/clients");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete client");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await clientService.updateClientStatus(id, newStatus);
      setClient((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    const config = {
      active: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        border: "border-neon-green/30",
        label: "Active",
      },
      inactive: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        border: "border-gray-500/30",
        label: "Inactive",
      },
      on_hold: {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/30",
        label: "On Hold",
      },
    };
    return config[status] || config.active;
  };

  const getInvoiceStatusConfig = (status) => {
    const config = {
      draft: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Draft" },
      sent: { bg: "bg-neon-blue/20", text: "text-neon-blue", label: "Sent" },
      paid: { bg: "bg-neon-green/20", text: "text-neon-green", label: "Paid" },
      overdue: { bg: "bg-red-500/20", text: "text-red-400", label: "Overdue" },
      cancelled: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        label: "Cancelled",
      },
    };
    return config[status] || config.draft;
  };

  const getProposalStatusConfig = (status) => {
    const config = {
      draft: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Draft" },
      sent: { bg: "bg-neon-blue/20", text: "text-neon-blue", label: "Sent" },
      accepted: {
        bg: "bg-neon-green/20",
        text: "text-neon-green",
        label: "Accepted",
      },
      rejected: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Rejected",
      },
    };
    return config[status] || config.draft;
  };

  if (loading) {
    return <Loader />;
  }

  if (error && !client) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <Button variant="outline" onClick={() => navigate("/clients")}>
          Back to Clients
        </Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Client not found</p>
        <Button variant="outline" onClick={() => navigate("/clients")}>
          Back to Clients
        </Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(client.status);
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects", count: projects.length },
    { id: "invoices", label: "Invoices", count: invoices.length },
    { id: "proposals", label: "Proposals", count: proposals.length },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3 sm:mb-4"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
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
          <span className="text-sm sm:text-base">Back to Clients</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start sm:items-center gap-3">
          <svg
            className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 sm:mt-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-400 text-sm sm:text-base break-words min-w-0">{error}</p>
        </div>
      )}

      {/* Client Header Card */}
      <div className="glass-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-xl sm:text-3xl font-bold text-black">
                {client.businessName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                {client.businessName}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base truncate">{client.clientName}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                  {statusConfig.label}
                </span>
                {client.industry && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                    {client.industry}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => navigate(`/clients/${id}/edit`)}
            >
              <svg
                className="w-4 h-4 mr-1.5"
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
            <Button
              variant="neon"
              onClick={() => navigate(`/projects/new?clientId=${id}`)}
            >
              <svg
                className="w-4 h-4 mr-1.5"
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
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">Project</span>
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <svg
                className="w-4 h-4 sm:mr-1.5"
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
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
          <div className="text-center p-3 sm:p-4 rounded-xl bg-white/[0.02]">
            <p className="text-lg sm:text-2xl font-bold text-white">{projects.length}</p>
            <p className="text-xs sm:text-sm text-gray-400">Projects</p>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-white/[0.02] min-w-0">
            <p className="text-lg sm:text-2xl font-bold text-neon-green truncate">
              {formatCurrency(client.totalRevenue || 0)}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">Total Revenue</p>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-white/[0.02]">
            <p className="text-lg sm:text-2xl font-bold text-white">{invoices.length}</p>
            <p className="text-xs sm:text-sm text-gray-400">Invoices</p>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-xl bg-white/[0.02]">
            <p className="text-lg sm:text-2xl font-bold text-white">{proposals.length}</p>
            <p className="text-xs sm:text-sm text-gray-400">Proposals</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-neon-green/20" : "bg-white/10"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card title="Contact Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <InfoField label="Email">
                  <a
                    href={`mailto:${client.email}`}
                    className="text-white hover:text-neon-green transition-colors break-all text-sm sm:text-base"
                  >
                    {client.email}
                  </a>
                </InfoField>
                <InfoField label="Phone">
                  <a
                    href={`tel:${client.phone}`}
                    className="text-white hover:text-neon-green transition-colors text-sm sm:text-base"
                  >
                    {client.phone}
                  </a>
                </InfoField>
                {client.alternatePhone && (
                  <InfoField label="Alternate Phone">
                    <p className="text-white text-sm sm:text-base">{client.alternatePhone}</p>
                  </InfoField>
                )}
                {client.website && (
                  <InfoField label="Website">
                    <a
                      href={
                        client.website.startsWith("http")
                          ? client.website
                          : `https://${client.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-blue hover:text-neon-green transition-colors break-all text-sm sm:text-base"
                    >
                      {client.website}
                    </a>
                  </InfoField>
                )}
                {client.gstNumber && (
                  <InfoField label="GST Number">
                    <p className="text-white text-sm sm:text-base">{client.gstNumber}</p>
                  </InfoField>
                )}
              </div>
            </Card>

            {(client.address?.street || client.address?.city) && (
              <Card title="Address">
                <div className="text-gray-300 text-sm sm:text-base">
                  {client.address.street && <p>{client.address.street}</p>}
                  <p>
                    {[
                      client.address.city,
                      client.address.state,
                      client.address.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {client.address.country && <p>{client.address.country}</p>}
                </div>
              </Card>
            )}

            {client.contactPerson?.name && (
              <Card title="Additional Contact Person">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <InfoField label="Name">
                    <p className="text-white text-sm sm:text-base">{client.contactPerson.name}</p>
                  </InfoField>
                  {client.contactPerson.designation && (
                    <InfoField label="Designation">
                      <p className="text-white text-sm sm:text-base">
                        {client.contactPerson.designation}
                      </p>
                    </InfoField>
                  )}
                  {client.contactPerson.email && (
                    <InfoField label="Email">
                      <a
                        href={`mailto:${client.contactPerson.email}`}
                        className="text-white hover:text-neon-green transition-colors break-all text-sm sm:text-base"
                      >
                        {client.contactPerson.email}
                      </a>
                    </InfoField>
                  )}
                  {client.contactPerson.phone && (
                    <InfoField label="Phone">
                      <p className="text-white text-sm sm:text-base">{client.contactPerson.phone}</p>
                    </InfoField>
                  )}
                </div>
              </Card>
            )}

            {client.notes && (
              <Card title="Notes">
                <p className="text-gray-300 whitespace-pre-wrap break-words text-sm sm:text-base">
                  {client.notes}
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <Card title="Update Status">
              <div className="space-y-2">
                {["active", "inactive", "on_hold"].map((status) => {
                  const config = getStatusConfig(status);
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`w-full p-3 rounded-xl text-left transition-all duration-200 text-sm sm:text-base ${
                        client.status === status
                          ? `${config.bg} border ${config.border} ${config.text}`
                          : "bg-white/[0.02] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{config.label}</span>
                        {client.status === status && (
                          <svg
                            className="w-5 h-5 flex-shrink-0"
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
                  );
                })}
              </div>
            </Card>

            <Card title="Quick Actions">
              <div className="space-y-3">
                <QuickActionLink
                  href={`mailto:${client.email}`}
                  icon={
                    <svg
                      className="w-5 h-5 flex-shrink-0"
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
                  }
                  label="Send Email"
                />
                <QuickActionLink
                  href={`tel:${client.phone}`}
                  icon={
                    <svg
                      className="w-5 h-5 flex-shrink-0"
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
                  }
                  label="Call Now"
                />
                <QuickActionLink
                  href={`https://wa.me/91${client.phone}`}
                  icon={
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  }
                  label="WhatsApp"
                />
                <QuickActionLink
                  isButton
                  onClick={() => navigate(`/invoices/new?clientId=${id}`)}
                  icon={
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                      />
                    </svg>
                  }
                  label="Create Invoice"
                />
                <QuickActionLink
                  isButton
                  onClick={() => navigate(`/proposals/new?clientId=${id}`)}
                  icon={
                    <svg
                      className="w-5 h-5 flex-shrink-0"
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
                  }
                  label="Create Proposal"
                />
              </div>
            </Card>

            <Card title="Client Info">
              <div className="space-y-4">
                <InfoField label="Source">
                  <p className="text-white capitalize text-sm sm:text-base">
                    {client.source?.replace("_", " ")}
                  </p>
                </InfoField>
                <InfoField label="Client Since">
                  <p className="text-white text-sm sm:text-base">{formatDate(client.createdAt)}</p>
                </InfoField>
                <InfoField label="Last Updated">
                  <p className="text-white text-sm sm:text-base">{formatDate(client.updatedAt)}</p>
                </InfoField>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <Card
          title="Projects"
          actions={
            <Button
              variant="neon"
              size="sm"
              onClick={() => navigate(`/projects/new?clientId=${id}`)}
            >
              <svg
                className="w-4 h-4 mr-1"
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
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </Button>
          }
        >
          <ClientProjects projects={projects} clientId={id} />
        </Card>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <Card
          title="Invoices"
          actions={
            <Button
              variant="neon"
              size="sm"
              onClick={() => navigate(`/invoices/new?clientId=${id}`)}
            >
              <svg
                className="w-4 h-4 mr-1"
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
              <span className="hidden sm:inline">New Invoice</span>
              <span className="sm:hidden">New</span>
            </Button>
          }
        >
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-400 mb-4">No invoices yet</p>
              <button
                onClick={() => navigate(`/invoices/new?clientId=${id}`)}
                className="px-4 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg hover:bg-neon-green/20 transition-colors text-sm"
              >
                Create First Invoice
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {invoices.map((invoice) => {
                const statusConfig = getInvoiceStatusConfig(invoice.status);
                return (
                  <div
                    key={invoice._id}
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-white group-hover:text-neon-green transition-colors text-sm sm:text-base truncate">
                          {invoice.invoiceNumber ||
                            `INV-${invoice._id.slice(-6).toUpperCase()}`}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {formatDate(invoice.createdAt)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base sm:text-lg font-semibold text-neon-green whitespace-nowrap">
                          {formatCurrency(invoice.amount || invoice.total || 0)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Proposals Tab */}
      {activeTab === "proposals" && (
        <Card
          title="Proposals"
          actions={
            <Button
              variant="neon"
              size="sm"
              onClick={() => navigate(`/proposals/new?clientId=${id}`)}
            >
              <svg
                className="w-4 h-4 mr-1"
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
              <span className="hidden sm:inline">New Proposal</span>
              <span className="sm:hidden">New</span>
            </Button>
          }
        >
          {proposals.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-500"
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
              </div>
              <p className="text-gray-400 mb-4">No proposals yet</p>
              <button
                onClick={() => navigate(`/proposals/new?clientId=${id}`)}
                className="px-4 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg hover:bg-neon-green/20 transition-colors text-sm"
              >
                Create First Proposal
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {proposals.map((proposal) => {
                const statusConfig = getProposalStatusConfig(proposal.status);
                return (
                  <div
                    key={proposal._id}
                    onClick={() => navigate(`/proposals/${proposal._id}`)}
                    className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-white group-hover:text-neon-green transition-colors text-sm sm:text-base truncate">
                          {proposal.title || "Untitled Proposal"}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {formatDate(proposal.createdAt)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base sm:text-lg font-semibold text-neon-green whitespace-nowrap">
                          {formatCurrency(
                            proposal.amount || proposal.total || 0
                          )}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Client"
      >
        <p className="text-gray-300 mb-4 text-sm sm:text-base">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">{client.businessName}</span>?
        </p>
        <p className="text-gray-400 text-xs sm:text-sm mb-6">
          This will also affect all associated projects, invoices, and
          proposals. This action cannot be undone.
        </p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
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

export default ClientDetail;
