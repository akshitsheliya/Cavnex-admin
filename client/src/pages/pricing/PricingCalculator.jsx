import React, { useState, useMemo } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";

const PricingCalculator = () => {
  const [projectType, setProjectType] = useState("website");
  const [features, setFeatures] = useState([]);
  const [timeline, setTimeline] = useState("normal");
  const [support, setSupport] = useState("basic");
  const [customAddOns, setCustomAddOns] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [newAddOn, setNewAddOn] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");

  const projectTypes = [
    {
      id: "website",
      label: "Website",
      basePrice: 50000,
      icon: "🌐",
      description: "Business websites, portfolios, landing pages",
    },
    {
      id: "ecommerce",
      label: "E-commerce",
      basePrice: 150000,
      icon: "🛒",
      description: "Online stores with payment integration",
    },
    {
      id: "webapp",
      label: "Web Application",
      basePrice: 200000,
      icon: "💻",
      description: "Custom web-based software solutions",
    },
    {
      id: "mobile",
      label: "Mobile App",
      basePrice: 250000,
      icon: "📱",
      description: "iOS and Android applications",
    },
    {
      id: "enterprise",
      label: "Enterprise Solution",
      basePrice: 500000,
      icon: "🏢",
      description: "Large-scale business systems",
    },
  ];

  const featuresList = [
    {
      id: "auth",
      label: "User Authentication",
      price: 15000,
      icon: "🔐",
      category: "core",
    },
    {
      id: "payment",
      label: "Payment Integration",
      price: 25000,
      icon: "💳",
      category: "core",
    },
    {
      id: "admin",
      label: "Admin Dashboard",
      price: 30000,
      icon: "🎛️",
      category: "core",
    },
    {
      id: "api",
      label: "API Development",
      price: 40000,
      icon: "🔗",
      category: "advanced",
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      price: 20000,
      icon: "📊",
      category: "advanced",
    },
    {
      id: "seo",
      label: "SEO Optimization",
      price: 10000,
      icon: "🔍",
      category: "marketing",
    },
    {
      id: "responsive",
      label: "Responsive Design",
      price: 15000,
      icon: "📱",
      category: "core",
    },
    {
      id: "cms",
      label: "Content Management",
      price: 25000,
      icon: "📝",
      category: "core",
    },
    {
      id: "whatsapp",
      label: "WhatsApp Integration",
      price: 10000,
      icon: "💬",
      category: "integration",
    },
    {
      id: "email",
      label: "Email System",
      price: 8000,
      icon: "📧",
      category: "integration",
    },
    {
      id: "notification",
      label: "Push Notifications",
      price: 12000,
      icon: "🔔",
      category: "integration",
    },
    {
      id: "multilang",
      label: "Multi-language",
      price: 15000,
      icon: "🌍",
      category: "advanced",
    },
    {
      id: "booking",
      label: "Booking System",
      price: 20000,
      icon: "📅",
      category: "core",
    },
    {
      id: "chat",
      label: "Live Chat Support",
      price: 18000,
      icon: "💭",
      category: "integration",
    },
    {
      id: "social",
      label: "Social Login",
      price: 8000,
      icon: "👥",
      category: "core",
    },
    {
      id: "export",
      label: "Data Export (PDF/Excel)",
      price: 12000,
      icon: "📤",
      category: "advanced",
    },
  ];

  const timelineMultipliers = [
    {
      id: "relaxed",
      label: "Relaxed",
      duration: "3+ months",
      multiplier: 0.9,
      discount: "10% discount",
    },
    {
      id: "normal",
      label: "Normal",
      duration: "2-3 months",
      multiplier: 1.0,
      discount: "Standard",
    },
    {
      id: "fast",
      label: "Fast",
      duration: "1-2 months",
      multiplier: 1.3,
      discount: "30% extra",
    },
    {
      id: "urgent",
      label: "Urgent",
      duration: "< 1 month",
      multiplier: 1.6,
      discount: "60% extra",
    },
  ];

  const supportPlans = [
    {
      id: "none",
      label: "No Support",
      price: 0,
      description: "One-time delivery only",
      icon: "📦",
    },
    {
      id: "basic",
      label: "Basic",
      price: 5000,
      description: "Email support, bug fixes",
      icon: "📧",
    },
    {
      id: "standard",
      label: "Standard",
      price: 10000,
      description: "Email + Chat, minor updates",
      icon: "💬",
    },
    {
      id: "premium",
      label: "Premium",
      price: 20000,
      description: "24/7 priority support",
      icon: "⭐",
    },
  ];

  const featureCategories = [
    { id: "all", label: "All Features" },
    { id: "core", label: "Core" },
    { id: "advanced", label: "Advanced" },
    { id: "integration", label: "Integrations" },
    { id: "marketing", label: "Marketing" },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFeatures =
    activeCategory === "all"
      ? featuresList
      : featuresList.filter((f) => f.category === activeCategory);

  const toggleFeature = (featureId) => {
    setFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((f) => f !== featureId)
        : [...prev, featureId]
    );
  };

  const selectAllFeatures = () => {
    const allIds = featuresList.map((f) => f.id);
    setFeatures(allIds);
  };

  const clearAllFeatures = () => {
    setFeatures([]);
  };

  const handleAddCustomAddOn = () => {
    if (newAddOn.name && newAddOn.price) {
      setCustomAddOns((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newAddOn.name,
          price: Number(newAddOn.price),
          description: newAddOn.description,
        },
      ]);
      setNewAddOn({ name: "", price: "", description: "" });
      setShowAddOnModal(false);
    }
  };

  const removeCustomAddOn = (id) => {
    setCustomAddOns((prev) => prev.filter((a) => a.id !== id));
  };

  const calculation = useMemo(() => {
    const basePrice =
      projectTypes.find((p) => p.id === projectType)?.basePrice || 0;

    const featuresPrice = features.reduce((sum, featureId) => {
      const feature = featuresList.find((f) => f.id === featureId);
      return sum + (feature?.price || 0);
    }, 0);

    const customAddOnsPrice = customAddOns.reduce(
      (sum, addOn) => sum + addOn.price,
      0
    );

    const timelineMultiplier =
      timelineMultipliers.find((t) => t.id === timeline)?.multiplier || 1;
    const supportPrice = supportPlans.find((s) => s.id === support)?.price || 0;

    const subtotal = basePrice + featuresPrice + customAddOnsPrice;
    const timelineAdjusted = subtotal * timelineMultiplier;
    const timelineAdjustment = timelineAdjusted - subtotal;

    const discountAmount = timelineAdjusted * (discount / 100);
    const afterDiscount = timelineAdjusted - discountAmount;

    const total = afterDiscount + supportPrice;
    const gst = total * 0.18;
    const grandTotal = total + gst;

    // Estimated days calculation
    const baseDays = {
      website: 30,
      ecommerce: 60,
      webapp: 75,
      mobile: 90,
      enterprise: 120,
    };

    let estimatedDays = baseDays[projectType] || 45;
    estimatedDays += features.length * 3; // 3 days per feature
    estimatedDays += customAddOns.length * 5; // 5 days per custom add-on

    // Adjust based on timeline
    const timelineReduction = {
      relaxed: 1.2,
      normal: 1,
      fast: 0.7,
      urgent: 0.5,
    };
    estimatedDays = Math.ceil(
      estimatedDays * (timelineReduction[timeline] || 1)
    );

    return {
      basePrice,
      featuresPrice,
      customAddOnsPrice,
      subtotal,
      timelineMultiplier,
      timelineAdjustment,
      discountAmount,
      afterDiscount,
      supportPrice,
      total,
      gst,
      grandTotal,
      estimatedDays,
      featureCount: features.length,
      addOnCount: customAddOns.length,
    };
  }, [projectType, features, customAddOns, timeline, support, discount]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportPDF = () => {
    // This will be implemented with proposal generation
    alert("PDF Export - Coming Soon!");
  };

  const handleGenerateProposal = () => {
    const proposalData = {
      clientName,
      projectName,
      projectType: projectTypes.find((p) => p.id === projectType),
      selectedFeatures: features.map((id) =>
        featuresList.find((f) => f.id === id)
      ),
      customAddOns,
      timeline: timelineMultipliers.find((t) => t.id === timeline),
      support: supportPlans.find((s) => s.id === support),
      discount,
      calculation,
      createdAt: new Date().toISOString(),
    };

    alert("Proposal Generated! Check console for data.");
  };

  const handleSaveTemplate = () => {
    const template = {
      name: `${projectType}-template-${Date.now()}`,
      projectType,
      features,
      customAddOns,
      timeline,
      support,
      discount,
    };
    // Save to localStorage for now
    const templates = JSON.parse(
      localStorage.getItem("pricingTemplates") || "[]"
    );
    templates.push(template);
    localStorage.setItem("pricingTemplates", JSON.stringify(templates));
    alert("Template saved successfully!");
  };

  const resetCalculator = () => {
    setProjectType("website");
    setFeatures([]);
    setCustomAddOns([]);
    setTimeline("normal");
    setSupport("basic");
    setDiscount(0);
    setClientName("");
    setProjectName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Pricing Calculator</h1>
          <p className="text-gray-400 mt-1">
            Calculate project estimates instantly
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(features.length > 0 || customAddOns.length > 0) && (
            <Button variant="ghost" onClick={resetCalculator}>
              Reset All
            </Button>
          )}
          <Button variant="outline" onClick={handleExportPDF}>
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-neon-green">
            {calculation.featureCount}
          </p>
          <p className="text-sm text-gray-400">Features Selected</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-neon-blue">
            {calculation.addOnCount}
          </p>
          <p className="text-sm text-gray-400">Custom Add-ons</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">
            {calculation.estimatedDays}
          </p>
          <p className="text-sm text-gray-400">Est. Days</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">
            {formatCurrency(calculation.grandTotal)}
          </p>
          <p className="text-sm text-gray-400">Grand Total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Project Info */}
          <Card title="Project Information" subtitle="Basic project details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Client Name"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <Input
                label="Project Name"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
          </Card>

          {/* Project Type */}
          <Card title="Project Type" subtitle="Select your project category">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setProjectType(type.id)}
                  className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                    projectType === type.id
                      ? "bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_20px_rgba(0,255,136,0.2)]"
                      : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="text-2xl block mb-2">{type.icon}</span>
                  <span className="text-sm font-medium block">
                    {type.label}
                  </span>
                  <span className="text-xs text-gray-500 block mt-1">
                    {formatCurrency(type.basePrice)}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              {projectTypes.find((p) => p.id === projectType)?.description}
            </p>
          </Card>

          {/* Features */}
          <Card
            title="Features"
            subtitle="Select required features"
            action={
              <div className="flex gap-2">
                <button
                  onClick={selectAllFeatures}
                  className="text-sm text-neon-green hover:underline"
                >
                  Select All
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={clearAllFeatures}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
            }
          >
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {featureCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    activeCategory === cat.id
                      ? "bg-neon-green text-black font-medium"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                    features.includes(feature.id)
                      ? "bg-neon-green/10 border-neon-green"
                      : "bg-white/[0.02] border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{feature.icon}</span>
                    <span
                      className={`font-medium ${features.includes(feature.id) ? "text-neon-green" : "text-white"}`}
                    >
                      {feature.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      {formatCurrency(feature.price)}
                    </span>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        features.includes(feature.id)
                          ? "bg-neon-green border-neon-green"
                          : "border-white/20"
                      }`}
                    >
                      {features.includes(feature.id) && (
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
              ))}
            </div>
          </Card>

          {/* Custom Add-ons */}
          <Card
            title="Custom Add-ons"
            subtitle="Add custom features or services"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddOnModal(true)}
              >
                + Add Custom
              </Button>
            }
          >
            {customAddOns.length > 0 ? (
              <div className="space-y-3">
                {customAddOns.map((addOn) => (
                  <div
                    key={addOn.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <span className="text-lg">🎯</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{addOn.name}</p>
                        {addOn.description && (
                          <p className="text-sm text-gray-500">
                            {addOn.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-neon-green font-semibold">
                        {formatCurrency(addOn.price)}
                      </span>
                      <button
                        onClick={() => removeCustomAddOn(addOn.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No custom add-ons added yet</p>
                <p className="text-sm mt-1">
                  Click "Add Custom" to add custom features
                </p>
              </div>
            )}
          </Card>

          {/* Timeline */}
          <Card title="Timeline" subtitle="Project delivery timeline">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timelineMultipliers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeline(t.id)}
                  className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                    timeline === t.id
                      ? "bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                      : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="text-lg font-semibold block">{t.label}</span>
                  <span className="text-sm block mt-1 opacity-70">
                    {t.duration}
                  </span>
                  <span
                    className={`text-xs mt-2 block ${
                      t.multiplier < 1
                        ? "text-neon-green"
                        : t.multiplier > 1
                          ? "text-amber-400"
                          : "text-gray-500"
                    }`}
                  >
                    {t.discount}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Support Plan */}
          <Card title="Support Plan" subtitle="Post-launch support (monthly)">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {supportPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSupport(plan.id)}
                  className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                    support === plan.id
                      ? "bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                      : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="text-2xl block mb-2">{plan.icon}</span>
                  <span className="font-medium block">{plan.label}</span>
                  <span className="text-sm mt-1 block">
                    {plan.price === 0
                      ? "Free"
                      : `${formatCurrency(plan.price)}/mo`}
                  </span>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {plan.description}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Discount */}
          <Card title="Discount" subtitle="Apply discount percentage">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-green"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0%</span>
                  <span>10%</span>
                  <span>20%</span>
                  <span>30%</span>
                </div>
              </div>
              <div className="w-24 text-center">
                <span className="text-3xl font-bold text-neon-green">
                  {discount}%
                </span>
                <p className="text-xs text-gray-500">Discount</p>
              </div>
            </div>
            {discount > 0 && (
              <p className="mt-4 text-sm text-neon-green">
                You save {formatCurrency(calculation.discountAmount)}
              </p>
            )}
          </Card>
        </div>

        {/* Right Side - Price Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-neon-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Price Summary
            </h3>

            <div className="space-y-4">
              {/* Base Price */}
              <div className="flex justify-between text-gray-400">
                <span className="flex items-center gap-2">
                  <span>
                    {projectTypes.find((p) => p.id === projectType)?.icon}
                  </span>
                  Base Price
                </span>
                <span className="text-white font-medium">
                  {formatCurrency(calculation.basePrice)}
                </span>
              </div>

              {/* Features */}
              <div className="flex justify-between text-gray-400">
                <span>Features ({features.length})</span>
                <span className="text-white font-medium">
                  {formatCurrency(calculation.featuresPrice)}
                </span>
              </div>

              {/* Custom Add-ons */}
              {calculation.customAddOnsPrice > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Custom Add-ons ({customAddOns.length})</span>
                  <span className="text-white font-medium">
                    {formatCurrency(calculation.customAddOnsPrice)}
                  </span>
                </div>
              )}

              {/* Timeline Adjustment */}
              <div className="flex justify-between text-gray-400">
                <span>Timeline Adjustment</span>
                <span
                  className={`font-medium ${
                    calculation.timelineAdjustment < 0
                      ? "text-neon-green"
                      : calculation.timelineAdjustment > 0
                        ? "text-amber-400"
                        : "text-gray-500"
                  }`}
                >
                  {calculation.timelineAdjustment === 0
                    ? "-"
                    : `${calculation.timelineAdjustment > 0 ? "+" : ""}${formatCurrency(calculation.timelineAdjustment)}`}
                </span>
              </div>

              {/* Discount */}
              {discount > 0 && (
                <div className="flex justify-between text-neon-green">
                  <span>Discount ({discount}%)</span>
                  <span className="font-medium">
                    -{formatCurrency(calculation.discountAmount)}
                  </span>
                </div>
              )}

              {/* Support Plan */}
              <div className="flex justify-between text-gray-400">
                <span>Support Plan</span>
                <span className="text-white font-medium">
                  {calculation.supportPrice === 0
                    ? "Free"
                    : `${formatCurrency(calculation.supportPrice)}/mo`}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">
                    {formatCurrency(calculation.total)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400 mt-2">
                  <span>GST (18%)</span>
                  <span className="text-white font-medium">
                    {formatCurrency(calculation.gst)}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                    {formatCurrency(calculation.grandTotal)}
                  </span>
                </div>
                {calculation.supportPrice > 0 && (
                  <p className="text-xs text-gray-500 text-right mt-1">
                    + {formatCurrency(calculation.supportPrice)}/mo support
                  </p>
                )}
              </div>

              {/* Estimated Time */}
              <div className="mt-4 p-3 rounded-xl bg-neon-blue/10 border border-neon-blue/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-neon-blue"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-300">Estimated Time</span>
                  </div>
                  <span className="text-neon-blue font-semibold">
                    {calculation.estimatedDays} days
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                variant="neon"
                fullWidth
                onClick={handleGenerateProposal}
                disabled={features.length === 0}
              >
                Generate Proposal
              </Button>
              <Button variant="outline" fullWidth onClick={handleSaveTemplate}>
                Save as Template
              </Button>
            </div>

            {/* Empty State */}
            {features.length === 0 && customAddOns.length === 0 && (
              <p className="text-center text-gray-500 text-sm mt-4">
                Select features to see pricing
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Add-on Modal */}
      <Modal
        isOpen={showAddOnModal}
        onClose={() => {
          setShowAddOnModal(false);
          setNewAddOn({ name: "", price: "", description: "" });
        }}
        title="Add Custom Add-on"
      >
        <div className="space-y-4">
          <Input
            label="Add-on Name"
            placeholder="Enter add-on name"
            value={newAddOn.name}
            onChange={(e) =>
              setNewAddOn((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <Input
            label="Price (₹)"
            type="text"
            placeholder="Enter price"
            value={newAddOn.price}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              setNewAddOn((prev) => ({ ...prev, price: val }));
            }}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={newAddOn.description}
              onChange={(e) =>
                setNewAddOn((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setShowAddOnModal(false);
                setNewAddOn({ name: "", price: "", description: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="neon"
              className="flex-1"
              onClick={handleAddCustomAddOn}
              disabled={!newAddOn.name || !newAddOn.price}
            >
              Add Add-on
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PricingCalculator;
