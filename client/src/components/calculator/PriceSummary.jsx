import React from "react";
import Button from "../common/Button";
import { maintenancePlans } from "../../data/pricingData";

const PriceSummary = ({
  calculations,
  selectedFeatures,
  customAddOns,
  discount,
  setDiscount,
  urgentDelivery,
  setUrgentDelivery,
  selectedMaintenance,
  setSelectedMaintenance,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="glass-card p-6 sticky top-6">
      <h3 className="text-xl font-bold text-white mb-6">Price Summary</h3>

      {/* Selected features summary */}
      {selectedFeatures.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3">
            Selected Features ({selectedFeatures.length})
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {selectedFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span>{feature.icon}</span>
                  <span className="text-gray-300">{feature.name}</span>
                </div>
                <span className="text-white">
                  {formatCurrency(feature.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom add-ons summary */}
      {customAddOns.length > 0 && (
        <div className="mb-6 pt-4 border-t border-white/5">
          <p className="text-sm text-gray-400 mb-3">
            Custom Add-ons ({customAddOns.length})
          </p>
          <div className="space-y-2">
            {customAddOns.map((addOn) => (
              <div
                key={addOn.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-300">{addOn.name}</span>
                <span className="text-white">
                  {formatCurrency(addOn.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgent delivery toggle */}
      <div className="mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">⚡ Urgent Delivery</p>
            <p className="text-xs text-gray-500">30% faster, +20% cost</p>
          </div>
          <button
            onClick={() => setUrgentDelivery(!urgentDelivery)}
            className={`
                            w-12 h-6 rounded-full transition-all duration-300 relative
                            ${urgentDelivery ? "bg-neon-green" : "bg-white/10"}
                        `}
          >
            <div
              className={`
                            absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300
                            ${urgentDelivery ? "left-7" : "left-1"}
                        `}
            />
          </button>
        </div>
      </div>

      {/* Discount input */}
      <div className="mb-4">
        <label className="text-sm text-gray-400 mb-2 block">Discount (%)</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            min="0"
            max="50"
            maxLength={2}
            value={discount}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
              setDiscount(Math.min(50, Math.max(0, Number(val))));
            }}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
          />
          <span className="text-gray-400">%</span>
        </div>
      </div>

      {/* Maintenance plan */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">
          Maintenance Plan
        </label>
        <select
          value={selectedMaintenance}
          onChange={(e) => setSelectedMaintenance(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
        >
          {maintenancePlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}{" "}
              {plan.price > 0 && `- ${formatCurrency(plan.price)}/mo`}
            </option>
          ))}
        </select>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Features Subtotal</span>
          <span className="text-white">
            {formatCurrency(calculations.featuresSubtotal)}
          </span>
        </div>

        {calculations.addOnsSubtotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Add-ons Subtotal</span>
            <span className="text-white">
              {formatCurrency(calculations.addOnsSubtotal)}
            </span>
          </div>
        )}

        {calculations.urgentCharge > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-amber-400">Urgent Delivery (+20%)</span>
            <span className="text-amber-400">
              +{formatCurrency(calculations.urgentCharge)}
            </span>
          </div>
        )}

        {calculations.discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-neon-green">Discount ({discount}%)</span>
            <span className="text-neon-green">
              -{formatCurrency(calculations.discountAmount)}
            </span>
          </div>
        )}

        {calculations.maintenanceCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Maintenance</span>
            <span className="text-white">
              {formatCurrency(calculations.maintenanceCost)}/mo
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">GST (18%)</span>
          <span className="text-white">{formatCurrency(calculations.gst)}</span>
        </div>
      </div>

      {/* Grand total */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Grand Total</span>
          <div className="text-right">
            <span className="text-3xl font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
              {formatCurrency(calculations.grandTotal)}
            </span>
            {calculations.maintenanceCost > 0 && (
              <p className="text-xs text-gray-500">+ maintenance</p>
            )}
          </div>
        </div>
      </div>

      {/* Estimated time */}
      {calculations.estimatedDays > 0 && (
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
              {calculations.estimatedDays} days
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 space-y-3">
        <Button
          variant="neon"
          className="w-full"
          disabled={calculations.selectedCount === 0}
        >
          Generate Proposal
        </Button>
        <Button
          variant="outline"
          className="w-full"
          disabled={calculations.selectedCount === 0}
        >
          Download Quote
        </Button>
      </div>

      {/* Empty state */}
      {calculations.selectedCount === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Select features to see pricing
        </p>
      )}
    </div>
  );
};

export default PriceSummary;
