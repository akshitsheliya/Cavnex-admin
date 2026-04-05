import React from "react";
import Input from "../common/Input";
import Card from "../common/Card";

const DynamicFieldsForm = ({ fields, onChange, clients = [] }) => {
  const handleChange = (field, value) => {
    onChange({
      ...fields,
      [field]: value,
    });
  };

  const handleAddressChange = (addressField, value) => {
    const currentAddress =
      typeof fields.clientAddress === "object"
        ? fields.clientAddress
        : { street: "", city: "", state: "", country: "India", pincode: "" };

    onChange({
      ...fields,
      clientAddress: {
        ...currentAddress,
        [addressField]: value,
      },
    });
  };

  const handlePaymentScheduleChange = (index, field, value) => {
    const updatedSchedule = [...(fields.paymentSchedule || [])];
    updatedSchedule[index] = {
      ...updatedSchedule[index],
      [field]: field === "percentage" ? Number(value) : value,
    };
    handleChange("paymentSchedule", updatedSchedule);
  };

  const addPaymentMilestone = () => {
    const currentSchedule = fields.paymentSchedule || [];
    handleChange("paymentSchedule", [
      ...currentSchedule,
      { milestone: "", percentage: 0, dueDate: "" },
    ]);
  };

  const removePaymentMilestone = (index) => {
    const updatedSchedule = fields.paymentSchedule.filter(
      (_, i) => i !== index
    );
    handleChange("paymentSchedule", updatedSchedule);
  };

  // Get address values (handle both string and object)
  const getAddressValue = (field) => {
    if (
      typeof fields.clientAddress === "object" &&
      fields.clientAddress !== null
    ) {
      return fields.clientAddress[field] || "";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card title="Client Information" subtitle="Enter client details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Client Name"
            placeholder="Enter client name"
            value={fields.clientName || ""}
            onChange={(e) => handleChange("clientName", e.target.value)}
            required
          />
          <Input
            label="Business Name"
            placeholder="Enter business name"
            value={fields.businessName || ""}
            onChange={(e) => handleChange("businessName", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="client@example.com"
            value={fields.clientEmail || ""}
            onChange={(e) => handleChange("clientEmail", e.target.value)}
          />
          <Input
            label="Phone"
            placeholder="+91 9876543210"
            value={fields.clientPhone || ""}
            onChange={(e) => handleChange("clientPhone", e.target.value)}
          />
        </div>

        {/* Address Fields */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Client Address
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Street Address"
                value={getAddressValue("street")}
                onChange={(e) => handleAddressChange("street", e.target.value)}
              />
            </div>
            <Input
              placeholder="City"
              value={getAddressValue("city")}
              onChange={(e) => handleAddressChange("city", e.target.value)}
            />
            <Input
              placeholder="State"
              value={getAddressValue("state")}
              onChange={(e) => handleAddressChange("state", e.target.value)}
            />
            <Input
              placeholder="Country"
              value={getAddressValue("country") || "India"}
              onChange={(e) => handleAddressChange("country", e.target.value)}
            />
            <Input
              placeholder="Pincode"
              value={getAddressValue("pincode")}
              onChange={(e) => handleAddressChange("pincode", e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Project Information */}
      <Card title="Project Information" subtitle="Enter project details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Name"
            placeholder="Enter project name"
            value={fields.projectName || ""}
            onChange={(e) => handleChange("projectName", e.target.value)}
            required
          />
          <Input
            label="Timeline"
            placeholder="e.g., 8 weeks"
            value={fields.timeline || ""}
            onChange={(e) => handleChange("timeline", e.target.value)}
            required
          />
          <Input
            label="Start Date"
            type="date"
            value={fields.startDate || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={fields.endDate || ""}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
          <Input
            label="Contract Value (₹)"
            type="text"
            placeholder="Enter amount"
            value={fields.price || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleChange("price", value);
            }}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={fields.currency || "INR"}
              onChange={(e) => handleChange("currency", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Description
          </label>
          <textarea
            value={fields.projectDescription || ""}
            onChange={(e) => handleChange("projectDescription", e.target.value)}
            placeholder="Describe the project scope..."
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
          />
        </div>
      </Card>

      {/* Payment Schedule */}
      <Card title="Payment Schedule" subtitle="Define payment milestones">
        <div className="space-y-4">
          {(fields.paymentSchedule || []).map((payment, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-end p-4 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <div className="col-span-12 md:col-span-4">
                <Input
                  label="Milestone"
                  placeholder="e.g., Project Kickoff"
                  value={payment.milestone || ""}
                  onChange={(e) =>
                    handlePaymentScheduleChange(
                      index,
                      "milestone",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <Input
                  label="Percentage"
                  type="text"
                  placeholder="40"
                  value={payment.percentage || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    handlePaymentScheduleChange(
                      index,
                      "percentage",
                      val
                    );
                  }}
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-neon-green">
                  ₹
                  {(
                    ((fields.price || 0) * (payment.percentage || 0)) /
                    100
                  ).toLocaleString()}
                </div>
              </div>
              <div className="col-span-10 md:col-span-2">
                <Input
                  label="Due Date"
                  placeholder="Upon signing"
                  value={payment.dueDate || ""}
                  onChange={(e) =>
                    handlePaymentScheduleChange(
                      index,
                      "dueDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <button
                  type="button"
                  onClick={() => removePaymentMilestone(index)}
                  className="w-full p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <svg
                    className="w-5 h-5 mx-auto"
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

          <button
            type="button"
            onClick={addPaymentMilestone}
            className="w-full p-4 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-neon-green/30 transition-all"
          >
            + Add Payment Milestone
          </button>

          {/* Total Check */}
          {fields.paymentSchedule && fields.paymentSchedule.length > 0 && (
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02]">
              <span className="text-gray-400">Total Percentage:</span>
              <span
                className={`text-lg font-bold ${
                  fields.paymentSchedule.reduce(
                    (sum, p) => sum + (p.percentage || 0),
                    0
                  ) === 100
                    ? "text-neon-green"
                    : "text-yellow-400"
                }`}
              >
                {fields.paymentSchedule.reduce(
                  (sum, p) => sum + (p.percentage || 0),
                  0
                )}
                %
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DynamicFieldsForm;
