import React from "react";

const ProposalFeatures = ({ features = [], projectType }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProjectTypeInfo = (type) => {
    const types = {
      website: { icon: "🌐", label: "Website" },
      ecommerce: { icon: "🛒", label: "E-commerce" },
      webapp: { icon: "💻", label: "Web Application" },
      mobile: { icon: "📱", label: "Mobile App" },
      enterprise: { icon: "🏢", label: "Enterprise Solution" },
      custom: { icon: "⚙️", label: "Custom Project" },
    };
    return types[type] || types.custom;
  };

  const typeInfo = getProjectTypeInfo(projectType);

  return (
    <div className="proposal-section p-8">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
          03
        </span>
        Features & Deliverables
      </h2>

      {/* Project Type Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
        <span className="text-xl">{typeInfo.icon}</span>
        <span className="text-white font-medium">{typeInfo.label}</span>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-neon-green/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center group-hover:bg-neon-green/30 transition-colors">
                  <svg
                    className="w-4 h-4 text-neon-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white">{feature.name}</h4>
              </div>
              {feature.price > 0 && (
                <span className="text-neon-green font-medium">
                  {formatCurrency(feature.price)}
                </span>
              )}
            </div>
            {feature.description && (
              <p className="text-sm text-gray-400 ml-11">
                {feature.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {features.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No features added yet</p>
        </div>
      )}

      {/* Total Features Summary */}
      {features.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-neon-green/5 border border-neon-green/20 flex items-center justify-between">
          <span className="text-gray-300">
            Total Features:{" "}
            <span className="text-white font-semibold">{features.length}</span>
          </span>
          <span className="text-neon-green font-semibold">
            {formatCurrency(
              features.reduce((sum, f) => sum + (f.price || 0), 0)
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProposalFeatures;
