import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PhoneInput from "../../components/common/PhoneInput";
import Loader from "../../components/common/Loader";
import leadService from "../../services/leadService";
import useFormValidation from "../../hooks/useFormValidation";
import { leadSchema } from "../../validations";

/* ─── Reusable styled select ─────────────────────────────────────────────── */
const StyledSelect = ({ label, name, value, onChange, options, required }) => (
  <div className="mb-5">
    {label && (
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label}
        {required && <span className="text-neon-green ml-1">*</span>}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white
                 focus:outline-none focus:border-neon-green/50 focus:bg-white/[0.07]
                 focus:shadow-[0_0_20px_rgba(0,255,136,0.15)]
                 transition-all duration-300 appearance-none cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/* ─── Reusable styled textarea ──────────────────────────────────────────── */
const StyledTextarea = ({ label, name, value, onChange, placeholder, rows = 4 }) => (
  <div className="mb-5">
    {label && (
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label}
      </label>
    )}
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl
                 text-white placeholder-gray-500
                 focus:outline-none focus:border-neon-green/50 focus:bg-white/[0.07]
                 focus:shadow-[0_0_20px_rgba(0,255,136,0.15)]
                 transition-all duration-300 resize-none"
    />
  </div>
);

/* ─── Main component ─────────────────────────────────────────────────────── */
const LeadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    values: formData,
    errors,
    handleChange,
    handleBlur,
    setValues,
    validate,
    isSubmitDisabled,
  } = useFormValidation(
    {
      leadName: "",
      businessName: "",
      businessType: "",
      phone: "",
      email: "",
      city: "",
      source: "website",
      status: "new",
      estimatedValue: "",
      notes: "",
      followUpDate: "",
    },
    leadSchema
  );

  useEffect(() => {
    if (isEditMode) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLead(id);
      const lead = response.data;
      setValues({
        leadName: lead.leadName || "",
        businessName: lead.businessName || "",
        businessType: lead.businessType || "",
        phone: lead.phone || "",
        email: lead.email || "",
        city: lead.city || "",
        source: lead.source || "website",
        status: lead.status || "new",
        estimatedValue: lead.estimatedValue || "",
        notes: lead.notes || "",
        followUpDate: lead.followUpDate ? lead.followUpDate.split("T")[0] : "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lead");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isValid = await validate();
    if (!isValid) return;

    try {
      setSubmitting(true);
      const dataToSubmit = {
        ...formData,
        estimatedValue: formData.estimatedValue
          ? Number(formData.estimatedValue)
          : 0,
      };

      if (isEditMode) {
        await leadService.updateLead(id, dataToSubmit);
      } else {
        await leadService.createLead(dataToSubmit);
      }

      navigate("/leads");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save lead");
    } finally {
      setSubmitting(false);
    }
  };

  const sourceOptions = [
    { value: "website", label: "Website" },
    { value: "instagram", label: "Instagram" },
    { value: "referral", label: "Referral" },
    { value: "google", label: "Google" },
    { value: "cold_call", label: "Cold Call" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "other", label: "Other" },
  ];

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "meeting", label: "Meeting" },
    { value: "proposal_sent", label: "Proposal Sent" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed_won", label: "Closed Won" },
    { value: "closed_lost", label: "Closed Lost" },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-0">
      {/* Back navigation & heading */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/leads")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
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
          <span className="text-sm">Back to Leads</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {isEditMode ? "Edit Lead" : "Add New Lead"}
        </h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">
          {isEditMode
            ? "Update lead information"
            : "Fill in the lead details below"}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-400 text-sm leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Contact Information Card */}
        <Card title="Contact Information" className="mb-5 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0">
            <Input
              label="Lead Name"
              name="leadName"
              value={formData.leadName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter lead name"
              error={errors.leadName}
              required
            />
            <Input
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter business name"
            />
            <Input
              label="Business Type"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              placeholder="e.g., E-commerce, SaaS, etc."
            />
            <PhoneInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter email address"
              error={errors.email}
              required
            />
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>
        </Card>

        {/* Lead Details Card */}
        <Card title="Lead Details" className="mb-5 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0">
            <StyledSelect
              label="Lead Source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              options={sourceOptions}
              required
            />
            <StyledSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
            <Input
              label="Estimated Value (₹)"
              name="estimatedValue"
              type="number"
              value={formData.estimatedValue}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter estimated value"
              error={errors.estimatedValue}
            />
            <Input
              label="Follow-up Date"
              name="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={handleChange}
            />
          </div>

          <StyledTextarea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional notes about this lead..."
            rows={4}
          />
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/leads")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="neon"
            loading={submitting}
            disabled={isSubmitDisabled(submitting)}
            className="w-full sm:w-auto"
          >
            {isEditMode ? "Update Lead" : "Create Lead"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
