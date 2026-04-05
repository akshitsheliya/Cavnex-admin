// LeadForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Select, DatePicker, Input as AntInput, message } from "antd";
import dayjs from "dayjs";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PhoneInput from "../../components/common/PhoneInput";
import Loader from "../../components/common/Loader";
import leadService from "../../services/leadService";

const { TextArea } = AntInput;
const { Option } = Select;

const LeadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      form.setFieldsValue({
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
        followUpDate: lead.followUpDate ? dayjs(lead.followUpDate) : null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lead");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setError("");
    try {
      setSubmitting(true);
      const dataToSubmit = {
        ...values,
        estimatedValue: values.estimatedValue
          ? Number(values.estimatedValue)
          : 0,
        followUpDate: values.followUpDate
          ? values.followUpDate.toISOString()
          : null,
      };

      if (isEditMode) {
        await leadService.updateLead(id, dataToSubmit);
        message.success("Lead updated successfully");
      } else {
        await leadService.createLead(dataToSubmit);
        message.success("Lead created successfully");
      }

      navigate("/leads");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save lead");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      {/* Back navigation & heading */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate("/leads")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3 sm:mb-4 group"
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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          {isEditMode ? "Edit Lead" : "Add New Lead"}
        </h1>
        <p className="text-gray-400 mt-1 text-xs sm:text-sm lg:text-base">
          {isEditMode
            ? "Update lead information"
            : "Fill in the lead details below"}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 sm:gap-3">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-400 text-xs sm:text-sm leading-relaxed">
            {error}
          </p>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          source: "website",
          status: "new",
        }}
        className="lead-form"
      >
        {/* Contact Information Card */}
        <Card title="Contact Information" className="mb-4 sm:mb-5 lg:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-3 sm:gap-y-4">
            <Form.Item
              label={
                <span className="text-gray-300 text-sm">
                  Lead Name <span className="text-neon-green">*</span>
                </span>
              }
              name="leadName"
              rules={[{ required: true, message: "Please enter lead name" }]}
              className="mb-0"
            >
              <AntInput
                placeholder="Enter lead name"
                className="custom-input h-10 sm:h-11 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl hover:border-neon-green/50 focus:border-neon-green/50"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-300 text-sm">Business Name</span>
              }
              name="businessName"
              className="mb-0"
            >
              <AntInput
                placeholder="Enter business name"
                className="custom-input h-10 sm:h-11 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl hover:border-neon-green/50 focus:border-neon-green/50"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-300 text-sm">Business Type</span>
              }
              name="businessType"
              className="mb-0"
            >
              <AntInput
                placeholder="e.g., E-commerce, SaaS, etc."
                className="custom-input h-10 sm:h-11 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl hover:border-neon-green/50 focus:border-neon-green/50"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-300 text-sm">
                  Phone Number <span className="text-neon-green">*</span>
                </span>
              }
              name="phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
              className="mb-0"
            >
              <AntInput
                placeholder="Enter phone number"
                className="custom-input h-10 sm:h-11 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl hover:border-neon-green/50 focus:border-neon-green/50"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-300 text-sm">
                  Email Address <span className="text-neon-green">*</span>
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              className="mb-0"
            >
              <AntInput
                placeholder="Enter email address"
                className="custom-input h-10 sm:h-11 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl hover:border-neon-green/50 focus:border-neon-green/50"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-300 text-sm">City</span>}
              name="city"
              className="mb-0"
            >
              <AntInput
                placeholder="Enter city"
                className="custom-input h-10 sm:h-11 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl hover:border-neon-green/50 focus:border-neon-green/50"
              />
            </Form.Item>
          </div>
        </Card>

        {/* Lead Details Card */}
        <Card title="Lead Details" className="mb-4 sm:mb-5 lg:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-3 sm:gap-y-4">
            <Form.Item
              label={
                <span className="text-gray-300 text-sm">
                  Lead Source <span className="text-neon-green">*</span>
                </span>
              }
              name="source"
              className="mb-0"
            >
              <Select
                placeholder="Select source"
                className="custom-select w-full h-10 sm:h-11"
                dropdownClassName="custom-dropdown"
                popupClassName="custom-dropdown"
              >
                {sourceOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-300 text-sm">Status</span>}
              name="status"
              className="mb-0"
            >
              <Select
                placeholder="Select status"
                className="custom-select w-full h-10 sm:h-11"
                dropdownClassName="custom-dropdown"
                popupClassName="custom-dropdown"
              >
                {statusOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-300 text-sm">
                  Estimated Value (₹)
                </span>
              }
              name="estimatedValue"
              className="mb-0"
            >
              <AntInput
                type="number"
                placeholder="Enter estimated value"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  e.target.value = value;
                }}
                className="custom-input h-10 sm:h-11 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl hover:border-neon-green/50 focus:border-neon-green/50"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-300 text-sm">Follow-up Date</span>
              }
              name="followUpDate"
              className="mb-0"
            >
              <DatePicker
                placeholder="Select date"
                className="custom-datepicker w-full h-10 sm:h-11 bg-white/5 border-white/10 text-white rounded-xl"
                format="DD/MM/YYYY"
                popupClassName="custom-datepicker-dropdown"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="text-gray-300 text-sm">Notes</span>}
            name="notes"
            className="mb-0 mt-3 sm:mt-4"
          >
            <TextArea
              rows={4}
              placeholder="Add any additional notes about this lead..."
              className="custom-textarea bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl hover:border-neon-green/50 focus:border-neon-green/50 resize-none"
            />
          </Form.Item>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
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
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {isEditMode ? "Update Lead" : "Create Lead"}
          </Button>
        </div>
      </Form>

      <style jsx global>{`
        .lead-form .ant-form-item-label > label {
          color: #d1d5db;
          font-size: 0.875rem;
        }
        .lead-form .ant-input,
        .lead-form .ant-input-number,
        .lead-form .ant-picker {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
        .lead-form .ant-input:hover,
        .lead-form .ant-input:focus,
        .lead-form .ant-picker:hover,
        .lead-form .ant-picker-focused {
          border-color: rgba(0, 255, 136, 0.5) !important;
        }
        .lead-form .ant-input::placeholder {
          color: #6b7280 !important;
        }
        .lead-form .ant-select-selector {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          height: 2.75rem !important;
          padding: 0 1rem !important;
        }
        .lead-form .ant-select-selection-item,
        .lead-form .ant-select-selection-placeholder {
          line-height: 2.75rem !important;
          color: white !important;
        }
        .lead-form .ant-select-selection-placeholder {
          color: #6b7280 !important;
        }
        .lead-form .ant-select:hover .ant-select-selector,
        .lead-form .ant-select-focused .ant-select-selector {
          border-color: rgba(0, 255, 136, 0.5) !important;
        }
        .lead-form .ant-select-arrow {
          color: #9ca3af !important;
        }
        .lead-form .ant-picker-input > input {
          color: white !important;
        }
        .lead-form .ant-picker-input > input::placeholder {
          color: #6b7280 !important;
        }
        .lead-form .ant-picker-suffix,
        .lead-form .ant-picker-clear {
          color: #9ca3af !important;
        }
        .custom-dropdown {
          background: #1a1a2e !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
        }
        .custom-dropdown .ant-select-item {
          color: white !important;
        }
        .custom-dropdown .ant-select-item-option-active,
        .custom-dropdown .ant-select-item-option-selected {
          background: rgba(0, 255, 136, 0.1) !important;
        }
        // .custom-datepicker-dropdown {
        //   background: #1a1a2e !important;
        // }
        .custom-datepicker-dropdown .ant-picker-panel {
          background: #1a1a2e !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .custom-datepicker-dropdown .ant-picker-header,
        .custom-datepicker-dropdown .ant-picker-content th,
        .custom-datepicker-dropdown .ant-picker-cell {
          color: white !important;
        }
        .custom-datepicker-dropdown
          .ant-picker-cell-in-view.ant-picker-cell-selected
          .ant-picker-cell-inner {
          background: #00ff88 !important;
          color: #000 !important;
        }
        @media (max-width: 640px) {
          .lead-form .ant-select-selector {
            height: 2.5rem !important;
          }
          .lead-form .ant-select-selection-item,
          .lead-form .ant-select-selection-placeholder {
            line-height: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LeadForm;
