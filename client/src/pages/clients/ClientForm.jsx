import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PhoneInput from "../../components/common/PhoneInput";
import Loader from "../../components/common/Loader";
import clientService from "../../services/clientService";
import useFormValidation from "../../hooks/useFormValidation";
import { clientSchema } from "../../validations";

const ClientForm = () => {
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
    handleNestedChange,
    handleDotNotationChange,
    setValues,
    validate,
    isSubmitDisabled,
  } = useFormValidation(
    {
      clientName: "",
      businessName: "",
      industry: "",
      email: "",
      phone: "",
      alternatePhone: "",
      website: "",
      // gstNumber: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
      },
      contactPerson: {
        name: "",
        designation: "",
        email: "",
        phone: "",
      },
      source: "other",
      status: "active",
      notes: "",
      tags: [],
    },
    clientSchema
  );

  useEffect(() => {
    if (isEditMode) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await clientService.getClient(id);
      const client = response.data;
      setValues({
        clientName: client.clientName || "",
        businessName: client.businessName || "",
        industry: client.industry || "",
        email: client.email || "",
        phone: client.phone || "",
        alternatePhone: client.alternatePhone || "",
        website: client.website || "",
        gstNumber: client.gstNumber || "",
        address: {
          street: client.address?.street || "",
          city: client.address?.city || "",
          state: client.address?.state || "",
          country: client.address?.country || "India",
          pincode: client.address?.pincode || "",
        },
        contactPerson: {
          name: client.contactPerson?.name || "",
          designation: client.contactPerson?.designation || "",
          email: client.contactPerson?.email || "",
          phone: client.contactPerson?.phone || "",
        },
        source: client.source || "other",
        status: client.status || "active",
        notes: client.notes || "",
        tags: client.tags || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch client");
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

      if (isEditMode) {
        await clientService.updateClient(id, formData);
      } else {
        await clientService.createClient(formData);
      }

      navigate("/clients");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save client");
    } finally {
      setSubmitting(false);
    }
  };

  const industryOptions = [
    "Technology",
    "E-commerce",
    "Healthcare",
    "Finance",
    "Education",
    "Real Estate",
    "Manufacturing",
    "Retail",
    "Food & Beverage",
    "Travel & Tourism",
    "Media & Entertainment",
    "Other",
  ];

  const sourceOptions = [
    { value: "website", label: "Website" },
    { value: "instagram", label: "Instagram" },
    { value: "referral", label: "Referral" },
    { value: "google", label: "Google" },
    { value: "cold_call", label: "Cold Call" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "lead_conversion", label: "Lead Conversion" },
    { value: "other", label: "Other" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on_hold", label: "On Hold" },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
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
          Back to Clients
        </button>
        <h1 className="text-3xl font-bold text-white">
          {isEditMode ? "Edit Client" : "Add New Client"}
        </h1>
        <p className="text-gray-400 mt-1">
          {isEditMode
            ? "Update client information"
            : "Fill in the client details below"}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-red-400 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Card title="Basic Information" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Person Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter contact person name"
              error={errors.clientName}
              required
            />
            <Input
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter business/company name"
              error={errors.businessName}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
              >
                <option value="">Select Industry</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://example.com"
              error={errors.website}
            />
          </div>
        </Card>

        <Card title="Contact Details" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <PhoneInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              required
            />
            <PhoneInput
              label="Alternate Phone"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.alternatePhone}
              placeholder="98765 43210"
            />
            <Input
              label="GST Number"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., 22AAAAA0000A1Z5"
              error={errors.gstNumber}
            />
          </div>
        </Card>

        <Card title="Address" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                name="address.street"
                value={formData.address.street}
                onChange={handleDotNotationChange}
                placeholder="Enter street address"
              />
            </div>
            <Input
              label="City"
              name="address.city"
              value={formData.address.city}
              onChange={handleDotNotationChange}
              placeholder="Enter city"
            />
            <Input
              label="State"
              name="address.state"
              value={formData.address.state}
              onChange={handleDotNotationChange}
              placeholder="Enter state"
            />
            <Input
              label="Country"
              name="address.country"
              value={formData.address.country}
              onChange={handleDotNotationChange}
              placeholder="Enter country"
            />
            <Input
              label="Pincode"
              name="address.pincode"
              value={formData.address.pincode}
              onChange={handleDotNotationChange}
              onBlur={handleBlur}
              placeholder="Enter pincode"
              error={errors["address.pincode"]}
            />
          </div>
        </Card>

        <Card title="Additional Contact Person" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="contactPerson.name"
              value={formData.contactPerson.name}
              onChange={handleDotNotationChange}
              onBlur={handleBlur}
              placeholder="Contact person name"
              error={errors["contactPerson.name"]}
            />
            <Input
              label="Designation"
              name="contactPerson.designation"
              value={formData.contactPerson.designation}
              onChange={handleDotNotationChange}
              placeholder="e.g., CEO, Manager"
            />
            <Input
              label="Email"
              name="contactPerson.email"
              type="email"
              value={formData.contactPerson.email}
              onChange={handleDotNotationChange}
              onBlur={handleBlur}
              placeholder="Contact person email"
              error={errors["contactPerson.email"]}
            />
            <PhoneInput
              label="Phone"
              name="contactPerson.phone"
              value={formData.contactPerson.phone}
              onChange={(e) =>
                handleNestedChange("contactPerson", "phone", e.target.value)
              }
              onBlur={handleBlur}
              placeholder="98765 43210"
              error={errors["contactPerson.phone"]}
            />
          </div>
        </Card>

        <Card title="Other Details" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
              >
                {sourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any additional notes about this client..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/clients")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="neon"
            loading={submitting}
            disabled={isSubmitDisabled(submitting)}
          >
            {isEditMode ? "Update Client" : "Create Client"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
