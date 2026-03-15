import React, { useState } from "react";
import Button from "../common/Button";

const AddOnInput = ({ customAddOns, onAdd, onRemove }) => {
  const [newAddOn, setNewAddOn] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newAddOn.name && newAddOn.price) {
      onAdd({
        name: newAddOn.name,
        price: Number(newAddOn.price),
        description: newAddOn.description,
      });
      setNewAddOn({ name: "", price: "", description: "" });
      setShowForm(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Custom Add-ons</h3>
          <p className="text-sm text-gray-400">
            Add custom features or services
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-green/30 text-white transition-all"
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
            Add Custom
          </button>
        )}
      </div>

      {/* Add-on form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Add-on name"
              value={newAddOn.name}
              onChange={(e) =>
                setNewAddOn((prev) => ({ ...prev, name: e.target.value }))
              }
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
              required
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={newAddOn.price}
              onChange={(e) =>
                setNewAddOn((prev) => ({ ...prev, price: e.target.value }))
              }
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
              min="0"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newAddOn.description}
              onChange={(e) =>
                setNewAddOn((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="neon" size="sm">
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setNewAddOn({ name: "", price: "", description: "" });
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Add-ons list */}
      {customAddOns.length > 0 ? (
        <div className="space-y-3">
          {customAddOns.map((addOn) => (
            <div
              key={addOn.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <p className="font-medium text-white">{addOn.name}</p>
                  {addOn.description && (
                    <p className="text-sm text-gray-500">{addOn.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-neon-green font-semibold">
                  {formatCurrency(addOn.price)}
                </span>
                <button
                  onClick={() => onRemove(addOn.id)}
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
        !showForm && (
          <div className="text-center py-6 text-gray-500">
            <p>No custom add-ons added yet</p>
          </div>
        )
      )}
    </div>
  );
};

export default AddOnInput;
