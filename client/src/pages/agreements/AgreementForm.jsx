import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import DynamicFieldsForm from "../../components/agreements/DynamicFieldsForm";
import AgreementSection from "../../components/agreements/AgreementSection";
import AgreementPreview from "../../components/agreements/AgreementPreview";
import agreementService from "../../services/agreementService";
import clientService from "../../services/clientService";
import {
  agreementTypes,
  defaultCompanyInfo,
  getDefaultSections,
} from "../../data/agreementTemplates";

const AgreementForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const clientIdFromUrl = searchParams.get("clientId");
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [clients, setClients] = useState([]);

  // Form Data
  const [formData, setFormData] = useState({
    title: "Software Development Agreement",
    type: "software_development",
    client: clientIdFromUrl || "",
    template: "standard",
    effectiveDate: new Date().toISOString().split("T")[0],

    // Dynamic Fields
    dynamicFields: {
      clientName: "",
      businessName: "",
      clientAddress: "",
      clientEmail: "",
      clientPhone: "",
      projectName: "",
      projectDescription: "",
      price: "",
      currency: "INR",
      timeline: "",
      startDate: "",
      endDate: "",
      paymentSchedule: [
        {
          milestone: "Project Commencement",
          percentage: 40,
          dueDate: "Upon signing",
        },
        {
          milestone: "Design Approval",
          percentage: 30,
          dueDate: "After design completion",
        },
        {
          milestone: "Final Delivery",
          percentage: 30,
          dueDate: "Upon project completion",
        },
      ],
    },

    // Company Info
    companyInfo: { ...defaultCompanyInfo },

    // Sections
    sections: {},

    // Signatures
    signatures: {
      company: { name: "", designation: "", signed: false },
      client: { name: "", designation: "", signed: false },
    },

    // Notes
    internalNotes: "",
  });

  const steps = [
    { id: 1, title: "Basic Info", icon: "📋" },
    { id: 2, title: "Client & Project", icon: "👤" },
    { id: 3, title: "Company Info", icon: "🏢" },
    { id: 4, title: "Agreement Sections", icon: "📄" },
    { id: 5, title: "Signatures", icon: "✍️" },
  ];

  useEffect(() => {
    fetchClients();
    if (isEditMode) {
      fetchAgreement();
    } else {
      // Set default sections
      setFormData((prev) => ({
        ...prev,
        sections: getDefaultSections(prev.dynamicFields),
      }));
    }
  }, [id]);

  useEffect(() => {
    // Update sections when dynamic fields change
    if (!isEditMode) {
      setFormData((prev) => ({
        ...prev,
        sections: getDefaultSections(prev.dynamicFields),
      }));
    }
  }, [
    formData.dynamicFields.projectName,
    formData.dynamicFields.price,
    formData.dynamicFields.clientName,
  ]);

  const fetchClients = async () => {
    try {
      const response = await clientService.getClients({ limit: 100 });
      setClients(response.data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  const fetchAgreement = async () => {
    try {
      setLoading(true);
      const response = await agreementService.getAgreement(id);
      const agreement = response.data;

      setFormData({
        ...formData,
        ...agreement,
        client: agreement.client?._id || "",
        effectiveDate: agreement.effectiveDate
          ? agreement.effectiveDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        dynamicFields: {
          ...formData.dynamicFields,
          ...agreement.dynamicFields,
          startDate: agreement.dynamicFields?.startDate
            ? agreement.dynamicFields.startDate.split("T")[0]
            : "",
          endDate: agreement.dynamicFields?.endDate
            ? agreement.dynamicFields.endDate.split("T")[0]
            : "",
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch agreement");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDynamicFieldsChange = (fields) => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: fields,
    }));
  };

  const handleCompanyInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value,
      },
    }));
  };

  const handleSectionUpdate = (sectionKey, sectionData) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: sectionData,
      },
    }));
  };

  const handleSignatureChange = (party, field, value) => {
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [party]: {
          ...prev.signatures[party],
          [field]: value,
        },
      },
    }));
  };

  const handleClientSelect = (clientId) => {
    const client = clients.find((c) => c._id === clientId);
    if (client) {
      // Convert client address to object format
      const clientAddress =
        typeof client.address === "object"
          ? client.address
          : {
              street: client.address?.street || "",
              city: client.address?.city || "",
              state: client.address?.state || "",
              country: client.address?.country || "India",
              pincode: client.address?.pincode || "",
            };

      setFormData((prev) => ({
        ...prev,
        client: clientId,
        dynamicFields: {
          ...prev.dynamicFields,
          clientName: client.clientName,
          businessName: client.businessName || "",
          clientAddress: clientAddress, // Now properly an object
          clientEmail: client.email || "",
          clientPhone: client.phone || "",
        },
      }));
    } else {
      handleChange("client", clientId);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.title) errors.push("Title is required");
    if (!formData.client) errors.push("Client is required");
    if (!formData.dynamicFields.clientName)
      errors.push("Client name is required");
    if (!formData.dynamicFields.projectName)
      errors.push("Project name is required");
    if (!formData.dynamicFields.price) errors.push("Price is required");
    if (!formData.dynamicFields.timeline) errors.push("Timeline is required");

    if (errors.length > 0) {
      setError(errors.join(", "));
      return false;
    }

    return true;
  };

  const handleSubmit = async (status = "draft") => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");

      const dataToSubmit = {
        ...formData,
        status,
      };

      if (isEditMode) {
        await agreementService.updateAgreement(id, dataToSubmit);
      } else {
        await agreementService.createAgreement(dataToSubmit);
      }

      navigate("/agreements");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save agreement");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/agreements")}
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
            Back to Agreements
          </button>
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? "Edit Agreement" : "Create Agreement"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleSubmit("draft")}
            loading={saving}
          >
            Save Draft
          </Button>
          <Button
            variant="neon"
            onClick={() => handleSubmit("draft")}
            loading={saving}
          >
            Save Agreement
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10 overflow-x-auto">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeStep === step.id
                ? "bg-neon-green text-black font-medium"
                : activeStep > step.id
                  ? "text-neon-green"
                  : "text-gray-400 hover:text-white"
            }`}
          >
            <span>{step.icon}</span>
            <span className="hidden md:inline">{step.title}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Basic Info */}
          {activeStep === 1 && (
            <Card
              title="Basic Information"
              subtitle="Agreement type and details"
            >
              <div className="space-y-4">
                <Input
                  label="Agreement Title"
                  placeholder="Enter agreement title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agreement Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {agreementTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleChange("type", type.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.type === type.id
                            ? "bg-neon-green/10 border-neon-green text-neon-green"
                            : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/30"
                        }`}
                      >
                        <span className="text-2xl block mb-2">{type.icon}</span>
                        <span className="text-sm font-medium block">
                          {type.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Client <span className="text-neon-green">*</span>
                    </label>
                    <select
                      value={formData.client}
                      onChange={(e) => handleClientSelect(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                    >
                      <option value="">Select Client</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.businessName || client.clientName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Effective Date"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) =>
                      handleChange("effectiveDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Client & Project */}
          {activeStep === 2 && (
            <DynamicFieldsForm
              fields={formData.dynamicFields}
              onChange={handleDynamicFieldsChange}
              clients={clients}
            />
          )}

          {/* Step 3: Company Info */}
          {activeStep === 3 && (
            <Card title="Company Information" subtitle="Your company details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  placeholder="Enter company name"
                  value={formData.companyInfo.name}
                  onChange={(e) =>
                    handleCompanyInfoChange("name", e.target.value)
                  }
                />
                <Input
                  label="Website"
                  placeholder="www.example.com"
                  value={formData.companyInfo.website}
                  onChange={(e) =>
                    handleCompanyInfoChange("website", e.target.value)
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.companyInfo.email}
                  onChange={(e) =>
                    handleCompanyInfoChange("email", e.target.value)
                  }
                />
                <Input
                  label="Phone"
                  placeholder="+91 9876543210"
                  value={formData.companyInfo.phone}
                  onChange={(e) =>
                    handleCompanyInfoChange("phone", e.target.value)
                  }
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.companyInfo.address}
                    onChange={(e) =>
                      handleCompanyInfoChange("address", e.target.value)
                    }
                    placeholder="Enter company address"
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                  />
                </div>
                <Input
                  label="GSTIN"
                  placeholder="Enter GSTIN"
                  value={formData.companyInfo.gstin}
                  onChange={(e) =>
                    handleCompanyInfoChange("gstin", e.target.value)
                  }
                />
                <Input
                  label="PAN"
                  placeholder="Enter PAN"
                  value={formData.companyInfo.pan}
                  onChange={(e) =>
                    handleCompanyInfoChange("pan", e.target.value)
                  }
                />
              </div>
            </Card>
          )}

          {/* Step 4: Agreement Sections */}
          {activeStep === 4 && (
            <Card
              title="Agreement Sections"
              subtitle="Customize agreement content"
            >
              <div className="space-y-6">
                {Object.entries(formData.sections).map(([key, section]) => (
                  <div
                    key={key}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <AgreementSection
                      section={section}
                      sectionKey={key}
                      onUpdate={handleSectionUpdate}
                      isEditing={true}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Step 5: Signatures */}
          {activeStep === 5 && (
            <Card title="Signatures" subtitle="Signatory information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Signatory */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Company Signatory
                  </h4>
                  <div className="space-y-4">
                    <Input
                      label="Name"
                      placeholder="Signatory name"
                      value={formData.signatures.company.name}
                      onChange={(e) =>
                        handleSignatureChange("company", "name", e.target.value)
                      }
                    />
                    <Input
                      label="Designation"
                      placeholder="e.g., Director"
                      value={formData.signatures.company.designation}
                      onChange={(e) =>
                        handleSignatureChange(
                          "company",
                          "designation",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* Client Signatory */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Client Signatory
                  </h4>
                  <div className="space-y-4">
                    <Input
                      label="Name"
                      placeholder="Signatory name"
                      value={
                        formData.signatures.client.name ||
                        formData.dynamicFields.clientName
                      }
                      onChange={(e) =>
                        handleSignatureChange("client", "name", e.target.value)
                      }
                    />
                    <Input
                      label="Designation"
                      placeholder="e.g., CEO"
                      value={formData.signatures.client.designation}
                      onChange={(e) =>
                        handleSignatureChange(
                          "client",
                          "designation",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Internal Notes (not included in agreement)
                </label>
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) =>
                    handleChange("internalNotes", e.target.value)
                  }
                  placeholder="Add internal notes..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                />
              </div>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
            >
              ← Previous
            </Button>
            {activeStep < 5 ? (
              <Button
                variant="neon"
                onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
              >
                Next →
              </Button>
            ) : (
              <Button
                variant="neon"
                onClick={() => handleSubmit("draft")}
                loading={saving}
              >
                Save Agreement
              </Button>
            )}
          </div>
        </div>

        {/* Right Sidebar - Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">
              Agreement Summary
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Type</p>
                <p className="text-white">
                  {agreementTypes.find((t) => t.id === formData.type)?.name ||
                    "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Client</p>
                <p className="text-white">
                  {formData.dynamicFields.businessName ||
                    formData.dynamicFields.clientName ||
                    "Not selected"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Project</p>
                <p className="text-white">
                  {formData.dynamicFields.projectName || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Timeline</p>
                <p className="text-white">
                  {formData.dynamicFields.timeline || "Not specified"}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-gray-500">Contract Value</p>
                <p className="text-2xl font-bold text-neon-green">
                  {formatCurrency(formData.dynamicFields.price)}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowPreview(true)}
              >
                Preview Agreement
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Agreement Preview"
        size="xl"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <AgreementPreview
            agreement={{
              ...formData,
              agreementNumber: "AGR-PREVIEW",
            }}
            showActions={true}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AgreementForm;
