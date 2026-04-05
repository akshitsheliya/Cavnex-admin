import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ProposalPreview from "../../components/proposals/ProposalPreview";
import proposalService from "../../services/proposalService";
import clientService from "../../services/clientService";
import projectService from "../../services/projectService";
import {
  defaultTermsAndConditions,
  defaultPaymentTerms,
  defaultPaymentMethods,
  defaultBankDetails,
} from "../../data/proposalTemplates";

const ProposalForm = () => {
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
  const [projects, setProjects] = useState([]);

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    client: clientIdFromUrl || "",
    project: "",
    projectType: "website",
    template: "modern",
    validUntil: "",

    // Cover Page
    coverPage: {
      companyName: "Cavnex",
      tagline: "Building Digital Excellence",
      preparedFor: "",
      preparedBy: "",
      date: new Date().toISOString().split("T")[0],
    },

    // Overview
    overview: {
      introduction: "",
      objectives: [""],
      challenges: "",
      solution: "",
    },

    // Scope
    scope: {
      included: [""],
      excluded: [""],
      assumptions: [""],
    },

    // Features
    features: [],

    // Timeline
    timeline: {
      startDate: "",
      endDate: "",
      totalDuration: "",
      milestones: [
        {
          title: "Discovery & Planning",
          duration: "1 week",
          deliverables: ["Requirements document", "Project plan"],
        },
        {
          title: "Design Phase",
          duration: "2 weeks",
          deliverables: ["Wireframes", "UI/UX designs"],
        },
        {
          title: "Development",
          duration: "4 weeks",
          deliverables: ["Frontend", "Backend", "Integration"],
        },
        {
          title: "Testing & Launch",
          duration: "1 week",
          deliverables: ["QA testing", "Deployment"],
        },
      ],
    },

    // Pricing
    pricing: {
      basePrice: 0,
      featuresPrice: 0,
      customAddOns: [],
      discount: 0,
      discountType: "percentage",
      tax: 18,
    },

    // Payment Terms
    paymentTerms: {
      terms: defaultPaymentTerms,
      paymentMethods: defaultPaymentMethods,
      bankDetails: defaultBankDetails,
      notes: "",
    },

    // Terms & Conditions
    termsAndConditions: defaultTermsAndConditions,

    // Notes
    internalNotes: "",
    clientMessage: "",
  });

  const projectTypes = [
    { id: "website", label: "Website", icon: "🌐", basePrice: 50000 },
    { id: "ecommerce", label: "E-commerce", icon: "🛒", basePrice: 150000 },
    { id: "webapp", label: "Web Application", icon: "💻", basePrice: 200000 },
    { id: "mobile", label: "Mobile App", icon: "📱", basePrice: 250000 },
    { id: "enterprise", label: "Enterprise", icon: "🏢", basePrice: 500000 },
    { id: "custom", label: "Custom", icon: "⚙️", basePrice: 0 },
  ];

  const featuresList = [
    { id: "auth", label: "User Authentication", price: 15000, icon: "🔐" },
    { id: "payment", label: "Payment Integration", price: 25000, icon: "💳" },
    { id: "admin", label: "Admin Dashboard", price: 30000, icon: "🎛️" },
    { id: "api", label: "API Development", price: 40000, icon: "🔗" },
    { id: "analytics", label: "Analytics & Reports", price: 20000, icon: "📊" },
    { id: "seo", label: "SEO Optimization", price: 10000, icon: "🔍" },
    { id: "responsive", label: "Responsive Design", price: 15000, icon: "📱" },
    { id: "cms", label: "Content Management", price: 25000, icon: "📝" },
    { id: "whatsapp", label: "WhatsApp Integration", price: 10000, icon: "💬" },
    { id: "email", label: "Email System", price: 8000, icon: "📧" },
    {
      id: "notification",
      label: "Push Notifications",
      price: 12000,
      icon: "🔔",
    },
    { id: "multilang", label: "Multi-language", price: 15000, icon: "🌍" },
  ];

  const steps = [
    { id: 1, title: "Basic Info", icon: "📋" },
    { id: 2, title: "Overview", icon: "📄" },
    { id: 3, title: "Scope", icon: "📑" },
    { id: 4, title: "Features", icon: "⚡" },
    { id: 5, title: "Timeline", icon: "📅" },
    { id: 6, title: "Pricing", icon: "💰" },
    { id: 7, title: "Terms", icon: "📜" },
  ];

  useEffect(() => {
    fetchClients();

    // Check if coming from calculator
    const fromCalculator = searchParams.get("fromCalculator");
    if (fromCalculator === "true") {
      const calculatorData = sessionStorage.getItem("calculatorData");
      if (calculatorData) {
        const data = JSON.parse(calculatorData);

        // Pre-fill form with calculator data
        setFormData((prev) => ({
          ...prev,
          title: `Proposal for ${data.projectName}`,
          projectType: data.projectType,
          features: data.features.map((f) => ({
            name: f.label,
            price: f.price,
            included: true,
          })),
          pricing: {
            ...prev.pricing,
            basePrice: data.calculation.basePrice,
            featuresPrice: data.calculation.featuresPrice,
            customAddOns: data.customAddOns || [],
            discount: data.discount,
          },
          timeline: {
            ...prev.timeline,
            totalDuration: data.timeline?.label || "",
          },
        }));

        // Clear session storage
        sessionStorage.removeItem("calculatorData");
      }
    }

    if (isEditMode) {
      fetchProposal();
    }
  }, [id, searchParams]);

  useEffect(() => {
    if (formData.client) {
      fetchClientProjects(formData.client);
    }
  }, [formData.client]);

  const fetchClients = async () => {
    try {
      const response = await clientService.getClients({ limit: 100 });
      setClients(response.data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  const fetchClientProjects = async (clientId) => {
    try {
      const response = await projectService.getProjects({
        client: clientId,
        limit: 50,
      });
      setProjects(response.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const response = await proposalService.getProposal(id);
      const proposal = response.data;

      setFormData({
        ...formData,
        ...proposal,
        client: proposal.client?._id || "",
        project: proposal.project?._id || "",
        validUntil: proposal.validUntil
          ? proposal.validUntil.split("T")[0]
          : "",
        coverPage: {
          ...formData.coverPage,
          ...proposal.coverPage,
          date: proposal.coverPage?.date
            ? proposal.coverPage.date.split("T")[0]
            : new Date().toISOString().split("T")[0],
        },
        timeline: {
          ...formData.timeline,
          ...proposal.timeline,
          startDate: proposal.timeline?.startDate
            ? proposal.timeline.startDate.split("T")[0]
            : "",
          endDate: proposal.timeline?.endDate
            ? proposal.timeline.endDate.split("T")[0]
            : "",
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch proposal");
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

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (parent, field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: prev[parent][field].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };

  const handleAddArrayItem = (parent, field, defaultValue = "") => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: [...prev[parent][field], defaultValue],
      },
    }));
  };

  const handleRemoveArrayItem = (parent, field, index) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: prev[parent][field].filter((_, i) => i !== index),
      },
    }));
  };

  const toggleFeature = (feature) => {
    setFormData((prev) => {
      const exists = prev.features.find((f) => f.name === feature.label);
      if (exists) {
        return {
          ...prev,
          features: prev.features.filter((f) => f.name !== feature.label),
          pricing: {
            ...prev.pricing,
            featuresPrice: prev.pricing.featuresPrice - feature.price,
          },
        };
      } else {
        return {
          ...prev,
          features: [
            ...prev.features,
            { name: feature.label, price: feature.price, included: true },
          ],
          pricing: {
            ...prev.pricing,
            featuresPrice: prev.pricing.featuresPrice + feature.price,
          },
        };
      }
    });
  };

  const handleClientChange = (clientId) => {
    const client = clients.find((c) => c._id === clientId);
    setFormData((prev) => ({
      ...prev,
      client: clientId,
      coverPage: {
        ...prev.coverPage,
        preparedFor: client?.businessName || client?.clientName || "",
      },
    }));
  };

  const handleProjectTypeChange = (type) => {
    const projectType = projectTypes.find((p) => p.id === type);
    setFormData((prev) => ({
      ...prev,
      projectType: type,
      pricing: {
        ...prev.pricing,
        basePrice: projectType?.basePrice || 0,
      },
    }));
  };

  const calculateTotals = () => {
    const {
      basePrice,
      featuresPrice,
      customAddOns,
      discount,
      discountType,
      tax,
    } = formData.pricing;

    let subtotal = basePrice + featuresPrice;
    if (customAddOns && customAddOns.length > 0) {
      subtotal += customAddOns.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );
    }

    let discountAmount = 0;
    if (discount > 0) {
      discountAmount =
        discountType === "percentage" ? subtotal * (discount / 100) : discount;
    }

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (tax / 100);
    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, afterDiscount, taxAmount, total };
  };

  const handleAddCustomAddOn = () => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        customAddOns: [...prev.pricing.customAddOns, { name: "", price: 0 }],
      },
    }));
  };

  const handleCustomAddOnChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        customAddOns: prev.pricing.customAddOns.map((item, i) =>
          i === index
            ? { ...item, [field]: field === "price" ? Number(value) : value }
            : item
        ),
      },
    }));
  };

  const handleRemoveCustomAddOn = (index) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        customAddOns: prev.pricing.customAddOns.filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: [
          ...prev.timeline.milestones,
          { title: "", duration: "", deliverables: [""] },
        ],
      },
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: prev.timeline.milestones.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleRemoveMilestone = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: prev.timeline.milestones.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (status = "draft") => {
    try {
      setSaving(true);
      setError("");

      const totals = calculateTotals();
      const dataToSubmit = {
        ...formData,
        status,
        pricing: {
          ...formData.pricing,
          subtotal: totals.afterDiscount,
          taxAmount: totals.taxAmount,
          total: totals.total,
        },
      };

      if (isEditMode) {
        await proposalService.updateProposal(id, dataToSubmit);
      } else {
        await proposalService.createProposal(dataToSubmit);
      }

      navigate("/proposals");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save proposal");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    // PDF generation will be implemented
    alert("PDF Download - Coming Soon!");
  };

  const handleSendProposal = async () => {
    await handleSubmit("sent");
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

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/proposals")}
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
            Back to Proposals
          </button>
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? "Edit Proposal" : "Create Proposal"}
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
            Save & Continue
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
        {steps.map((step, index) => (
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
              subtitle="Proposal details and client selection"
            >
              <div className="space-y-4">
                <Input
                  label="Proposal Title"
                  placeholder="Enter proposal title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Client <span className="text-neon-green">*</span>
                    </label>
                    <select
                      value={formData.client}
                      onChange={(e) => handleClientChange(e.target.value)}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project (Optional)
                    </label>
                    <select
                      value={formData.project}
                      onChange={(e) => handleChange("project", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                      disabled={!formData.client}
                    >
                      <option value="">Select Project</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.projectName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Type
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleProjectTypeChange(type.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          formData.projectType === type.id
                            ? "bg-neon-green/10 border-neon-green text-neon-green"
                            : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/30"
                        }`}
                      >
                        <span className="text-xl block">{type.icon}</span>
                        <span className="text-xs">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Valid Until"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => handleChange("validUntil", e.target.value)}
                  />
                  <Input
                    label="Prepared By"
                    placeholder="Your name"
                    value={formData.coverPage.preparedBy}
                    onChange={(e) =>
                      handleNestedChange(
                        "coverPage",
                        "preparedBy",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Overview */}
          {activeStep === 2 && (
            <Card
              title="Project Overview"
              subtitle="Introduction and objectives"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Introduction
                  </label>
                  <textarea
                    value={formData.overview.introduction}
                    onChange={(e) =>
                      handleNestedChange(
                        "overview",
                        "introduction",
                        e.target.value
                      )
                    }
                    placeholder="Introduce the project and your approach..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Objectives
                  </label>
                  {formData.overview.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={objective}
                        onChange={(e) =>
                          handleArrayChange(
                            "overview",
                            "objectives",
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Objective ${index + 1}`}
                        className="flex-1 mb-0"
                      />
                      {formData.overview.objectives.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveArrayItem(
                              "overview",
                              "objectives",
                              index
                            )
                          }
                          className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddArrayItem("overview", "objectives")}
                  >
                    + Add Objective
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Challenges (What problems are we solving?)
                  </label>
                  <textarea
                    value={formData.overview.challenges}
                    onChange={(e) =>
                      handleNestedChange(
                        "overview",
                        "challenges",
                        e.target.value
                      )
                    }
                    placeholder="Describe the challenges the client is facing..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Our Solution
                  </label>
                  <textarea
                    value={formData.overview.solution}
                    onChange={(e) =>
                      handleNestedChange("overview", "solution", e.target.value)
                    }
                    placeholder="Describe your proposed solution..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Scope */}
          {activeStep === 3 && (
            <Card
              title="Scope of Work"
              subtitle="Define what's included and excluded"
            >
              <div className="space-y-6">
                {/* Included */}
                <div>
                  <label className="block text-sm font-medium text-neon-green mb-2">
                    ✓ What's Included
                  </label>
                  {formData.scope.included.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(
                            "scope",
                            "included",
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Included item ${index + 1}`}
                        className="flex-1 mb-0"
                      />
                      {formData.scope.included.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveArrayItem("scope", "included", index)
                          }
                          className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddArrayItem("scope", "included")}
                  >
                    + Add Item
                  </Button>
                </div>

                {/* Excluded */}
                <div>
                  <label className="block text-sm font-medium text-red-400 mb-2">
                    ✗ What's Not Included
                  </label>
                  {formData.scope.excluded.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(
                            "scope",
                            "excluded",
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Excluded item ${index + 1}`}
                        className="flex-1 mb-0"
                      />
                      {formData.scope.excluded.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveArrayItem("scope", "excluded", index)
                          }
                          className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddArrayItem("scope", "excluded")}
                  >
                    + Add Item
                  </Button>
                </div>

                {/* Assumptions */}
                <div>
                  <label className="block text-sm font-medium text-amber-400 mb-2">
                    ⚠ Assumptions
                  </label>
                  {formData.scope.assumptions.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(
                            "scope",
                            "assumptions",
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Assumption ${index + 1}`}
                        className="flex-1 mb-0"
                      />
                      {formData.scope.assumptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveArrayItem("scope", "assumptions", index)
                          }
                          className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddArrayItem("scope", "assumptions")}
                  >
                    + Add Assumption
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Features */}
          {activeStep === 4 && (
            <Card
              title="Features & Deliverables"
              subtitle="Select features to include"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {featuresList.map((feature) => {
                  const isSelected = formData.features.some(
                    (f) => f.name === feature.label
                  );
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-neon-green/10 border-neon-green"
                          : "bg-white/[0.02] border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{feature.icon}</span>
                        <span
                          className={`font-medium ${isSelected ? "text-neon-green" : "text-white"}`}
                        >
                          {feature.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">
                          {formatCurrency(feature.price)}
                        </span>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-neon-green border-neon-green"
                              : "border-white/20"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-black"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {formData.features.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-neon-green/5 border border-neon-green/20 flex justify-between items-center">
                  <span className="text-gray-300">
                    {formData.features.length} features selected
                  </span>
                  <span className="text-neon-green font-semibold">
                    {formatCurrency(formData.pricing.featuresPrice)}
                  </span>
                </div>
              )}
            </Card>
          )}

          {/* Step 5: Timeline */}
          {activeStep === 5 && (
            <Card
              title="Project Timeline"
              subtitle="Define milestones and duration"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.timeline.startDate}
                    onChange={(e) =>
                      handleNestedChange(
                        "timeline",
                        "startDate",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.timeline.endDate}
                    onChange={(e) =>
                      handleNestedChange("timeline", "endDate", e.target.value)
                    }
                  />
                  <Input
                    label="Total Duration"
                    placeholder="e.g., 8-10 weeks"
                    value={formData.timeline.totalDuration}
                    onChange={(e) =>
                      handleNestedChange(
                        "timeline",
                        "totalDuration",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Milestones
                  </label>
                  <div className="space-y-4">
                    {formData.timeline.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-neon-green font-medium">
                            Phase {index + 1}
                          </span>
                          {formData.timeline.milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMilestone(index)}
                              className="text-gray-400 hover:text-red-400 transition-colors"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Milestone title"
                            value={milestone.title}
                            onChange={(e) =>
                              handleMilestoneChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="mb-0"
                          />
                          <Input
                            placeholder="Duration (e.g., 2 weeks)"
                            value={milestone.duration}
                            onChange={(e) =>
                              handleMilestoneChange(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            className="mb-0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddMilestone}
                    className="mt-3"
                  >
                    + Add Milestone
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 6: Pricing */}
          {activeStep === 6 && (
            <Card title="Pricing" subtitle="Set pricing and discounts">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Base Price (₹)"
                    type="text"
                    value={formData.pricing.basePrice}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      handleNestedChange(
                        "pricing",
                        "basePrice",
                        Number(val)
                      );
                    }}
                  />
                  <Input
                    label="Features Price (₹)"
                    type="text"
                    value={formData.pricing.featuresPrice}
                    onChange={(e) =>
                      handleNestedChange(
                        "pricing",
                        "featuresPrice",
                        Number(e.target.value)
                      )
                    }
                    disabled
                  />
                </div>

                {/* Custom Add-ons */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Add-ons
                  </label>
                  {formData.pricing.customAddOns.map((addOn, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add-on name"
                        value={addOn.name}
                        onChange={(e) =>
                          handleCustomAddOnChange(index, "name", e.target.value)
                        }
                        className="flex-1 mb-0"
                      />
                      <Input
                        type="text"
                        placeholder="Price"
                        value={addOn.price}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          handleCustomAddOnChange(
                            index,
                            "price",
                            val
                          );
                        }}
                        className="w-32 mb-0"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomAddOn(index)}
                        className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddCustomAddOn}
                  >
                    + Add Custom Item
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Discount (%)"
                    type="text"
                    maxLength={3}
                    min="0"
                    max="100"
                    value={formData.pricing.discount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
                      handleNestedChange(
                        "pricing",
                        "discount",
                        Number(val)
                      );
                    }}
                  />
                  <Input
                    label="Tax (%)"
                    type="text"
                    maxLength={3}
                    value={formData.pricing.tax}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
                      handleNestedChange(
                        "pricing",
                        "tax",
                        Number(val)
                      );
                    }}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 7: Terms */}
          {activeStep === 7 && (
            <Card
              title="Payment Terms & Conditions"
              subtitle="Define payment schedule and terms"
            >
              <div className="space-y-6">
                {/* Payment Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Payment Schedule
                  </label>
                  <div className="space-y-3">
                    {formData.paymentTerms.terms.map((term, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <Input
                          placeholder="Milestone"
                          value={term.milestone}
                          onChange={(e) => {
                            const newTerms = [...formData.paymentTerms.terms];
                            newTerms[index].milestone = e.target.value;
                            handleNestedChange(
                              "paymentTerms",
                              "terms",
                              newTerms
                            );
                          }}
                          className="flex-1 mb-0"
                        />
                        <Input
                          type="text"
                          maxLength={3}
                          placeholder="%"
                          value={term.percentage}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
                            const newTerms = [...formData.paymentTerms.terms];
                            newTerms[index].percentage = Number(val);
                            handleNestedChange(
                              "paymentTerms",
                              "terms",
                              newTerms
                            );
                          }}
                          className="w-24 mb-0"
                        />
                        <span className="text-neon-green font-medium w-32 text-right">
                          {formatCurrency(
                            totals.total * (term.percentage / 100)
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bank Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Bank Details
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Bank Name"
                      value={formData.paymentTerms.bankDetails.bankName}
                      onChange={(e) => {
                        handleNestedChange("paymentTerms", "bankDetails", {
                          ...formData.paymentTerms.bankDetails,
                          bankName: e.target.value,
                        });
                      }}
                    />
                    <Input
                      placeholder="Account Name"
                      value={formData.paymentTerms.bankDetails.accountName}
                      onChange={(e) => {
                        handleNestedChange("paymentTerms", "bankDetails", {
                          ...formData.paymentTerms.bankDetails,
                          accountName: e.target.value,
                        });
                      }}
                    />
                    <Input
                      placeholder="Account Number"
                      value={formData.paymentTerms.bankDetails.accountNumber}
                      onChange={(e) => {
                        handleNestedChange("paymentTerms", "bankDetails", {
                          ...formData.paymentTerms.bankDetails,
                          accountNumber: e.target.value,
                        });
                      }}
                    />
                    <Input
                      placeholder="IFSC Code"
                      value={formData.paymentTerms.bankDetails.ifscCode}
                      onChange={(e) => {
                        handleNestedChange("paymentTerms", "bankDetails", {
                          ...formData.paymentTerms.bankDetails,
                          ifscCode: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Internal Notes (won't be shown to client)
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
            {activeStep < 7 ? (
              <Button
                variant="neon"
                onClick={() => setActiveStep((prev) => Math.min(7, prev + 1))}
              >
                Next →
              </Button>
            ) : (
              <Button
                variant="neon"
                onClick={() => handleSubmit("draft")}
                loading={saving}
              >
                Save Proposal
              </Button>
            )}
          </div>
        </div>

        {/* Right Sidebar - Price Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">
              Price Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Base Price</span>
                <span className="text-white">
                  {formatCurrency(formData.pricing.basePrice)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Features ({formData.features.length})</span>
                <span className="text-white">
                  {formatCurrency(formData.pricing.featuresPrice)}
                </span>
              </div>
              {formData.pricing.customAddOns.length > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Add-ons ({formData.pricing.customAddOns.length})</span>
                  <span className="text-white">
                    {formatCurrency(
                      formData.pricing.customAddOns.reduce(
                        (sum, a) => sum + a.price,
                        0
                      )
                    )}
                  </span>
                </div>
              )}
              {formData.pricing.discount > 0 && (
                <div className="flex justify-between text-neon-green">
                  <span>Discount ({formData.pricing.discount}%)</span>
                  <span>-{formatCurrency(totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400 pt-3 border-t border-white/10">
                <span>Subtotal</span>
                <span className="text-white">
                  {formatCurrency(totals.afterDiscount)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST ({formData.pricing.tax}%)</span>
                <span className="text-white">
                  {formatCurrency(totals.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/10">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-neon-green">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowPreview(true)}
              >
                Preview Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Proposal Preview"
        size="xl"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <ProposalPreview
            proposal={{
              ...formData,
              proposalNumber: "PROP-PREVIEW",
              pricing: {
                ...formData.pricing,
                subtotal: totals.afterDiscount,
                taxAmount: totals.taxAmount,
                total: totals.total,
              },
            }}
            onDownloadPDF={handleDownloadPDF}
            onSendProposal={handleSendProposal}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProposalForm;
