import React from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { unitTypes } from "../../data/invoiceTemplates";

const InvoiceItems = ({ items, onChange }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "quantity" || field === "rate" ? Number(value) : value,
    };
    // Calculate amount
    newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    onChange(newItems);
  };

  const handleAddItem = () => {
    onChange([
      ...items,
      { description: "", quantity: 1, rate: 0, amount: 0, unit: "unit" },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  const handleDuplicateItem = (index) => {
    const newItems = [...items];
    newItems.splice(index + 1, 0, { ...items[index] });
    onChange(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 text-sm text-gray-400 font-medium px-2">
        <div className="col-span-5">Description</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 text-center">Rate</div>
        <div className="col-span-2 text-right">Amount</div>
        <div className="col-span-1"></div>
      </div>

      {/* Items */}
      {items.map((item, index) => (
        <div
          key={index}
          className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Description */}
            <div className="md:col-span-5">
              <label className="md:hidden text-sm text-gray-500 mb-1 block">
                Description
              </label>
              <textarea
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                placeholder="Item description..."
                rows={2}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none text-sm"
              />
            </div>

            {/* Quantity & Unit */}
            <div className="md:col-span-2">
              <label className="md:hidden text-sm text-gray-500 mb-1 block">
                Quantity
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center focus:outline-none focus:border-neon-green/50"
                />
                <select
                  value={item.unit || "unit"}
                  onChange={(e) =>
                    handleItemChange(index, "unit", e.target.value)
                  }
                  className="flex-1 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-neon-green/50"
                >
                  {unitTypes.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rate */}
            <div className="md:col-span-2">
              <label className="md:hidden text-sm text-gray-500 mb-1 block">
                Rate (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.rate}
                onChange={(e) =>
                  handleItemChange(index, "rate", e.target.value)
                }
                placeholder="0.00"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-right focus:outline-none focus:border-neon-green/50"
              />
            </div>

            {/* Amount */}
            <div className="md:col-span-2 flex items-center justify-end">
              <div className="text-right">
                <label className="md:hidden text-sm text-gray-500 mb-1 block">
                  Amount
                </label>
                <span className="text-lg font-semibold text-neon-green">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-1 flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => handleDuplicateItem(index)}
                className="p-2 text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Duplicate"
              >
                <svg
                  className="w-4 h-4"
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
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <svg
                    className="w-4 h-4"
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
      ))}

      {/* Add Item Button */}
      <button
        type="button"
        onClick={handleAddItem}
        className="w-full p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-neon-green/30 text-gray-400 hover:text-neon-green transition-all flex items-center justify-center gap-2"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Item
      </button>

      {/* Subtotal */}
      <div className="flex justify-end pt-4 border-t border-white/10">
        <div className="text-right">
          <span className="text-gray-400 mr-4">Subtotal:</span>
          <span className="text-xl font-bold text-white">
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItems;
