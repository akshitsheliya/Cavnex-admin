import React from "react";

const ProposalPricing = ({ pricing }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const data = pricing || {};

  return (
    <div className="proposal-section p-8">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center text-neon-green">
          05
        </span>
        Investment
      </h2>

      <div className="max-w-2xl mx-auto">
        {/* Pricing Table */}
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white text-center">
              Project Investment Breakdown
            </h3>
          </div>

          {/* Price Items */}
          <div className="p-6 space-y-4">
            {/* Base Price */}
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-300">Base Development</span>
              <span className="text-white font-medium">
                {formatCurrency(data.basePrice)}
              </span>
            </div>

            {/* Features */}
            {data.featuresPrice > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-gray-300">Additional Features</span>
                <span className="text-white font-medium">
                  {formatCurrency(data.featuresPrice)}
                </span>
              </div>
            )}

            {/* Custom Add-ons */}
            {data.customAddOns && data.customAddOns.length > 0 && (
              <>
                {data.customAddOns.map((addOn, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-white/5"
                  >
                    <span className="text-gray-300">{addOn.name}</span>
                    <span className="text-white font-medium">
                      {formatCurrency(addOn.price)}
                    </span>
                  </div>
                ))}
              </>
            )}

            {/* Discount */}
            {data.discount > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-white/5 text-neon-green">
                <span>
                  Discount (
                  {data.discountType === "percentage"
                    ? `${data.discount}%`
                    : "Fixed"}
                  )
                </span>
                <span className="font-medium">
                  -
                  {formatCurrency(
                    data.discountType === "percentage"
                      ? ((data.basePrice + data.featuresPrice) *
                          data.discount) /
                          100
                      : data.discount
                  )}
                </span>
              </div>
            )}

            {/* Subtotal */}
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-white font-medium">
                {formatCurrency(data.subtotal)}
              </span>
            </div>

            {/* Tax */}
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-300">GST ({data.tax || 18}%)</span>
              <span className="text-white font-medium">
                {formatCurrency(data.taxAmount)}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="p-6 bg-gradient-to-r from-neon-green/20 to-neon-blue/20">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white">
                Total Investment
              </span>
              <span className="text-3xl font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                {formatCurrency(data.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Value Note */}
        <div className="mt-6 p-4 rounded-xl bg-neon-green/5 border border-neon-green/20 text-center">
          <p className="text-sm text-gray-400">
            💡 This investment includes all development, testing, deployment,
            and 30-day warranty support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProposalPricing;
