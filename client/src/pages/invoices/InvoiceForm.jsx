import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import InvoiceItems from "../../components/invoices/InvoiceItems";
import InvoicePreview from "../../components/invoices/InvoicePreview";
import invoiceService from "../../services/invoiceService";
import clientService from "../../services/clientService";
import projectService from "../../services/projectService";
import {
  defaultCompanyInfo,
  defaultBankDetails,
  defaultTerms,
  defaultNotes,
  taxRates,
} from "../../data/invoiceTemplates";
import { validateSchema } from "../../utils/validators";
import { invoiceSchema } from "../../validations";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const clientIdFromUrl = searchParams.get("clientId");
  const projectIdFromUrl = searchParams.get("projectId");
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);

  // Form Data
  const [formData, setFormData] = useState({
    title: "Invoice",
    client: clientIdFromUrl || "",
    project: projectIdFromUrl || "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date.toISOString().split("T")[0];
    })(),

    // Billing Address
    billingAddress: {
      name: "",
      company: "",
      address: "",
      email: "",
      phone: "",
      gstin: "",
    },

    // Company Info
    companyInfo: { ...defaultCompanyInfo },

    // Items
    items: [{ description: "", quantity: 1, rate: 0, amount: 0, unit: "unit" }],

    // Pricing
    discount: 0,
    discountType: "percentage",
    taxRate: 18,

    // Bank Details
    bankDetails: { ...defaultBankDetails },

    // Notes
    notes: defaultNotes,
    terms: defaultTerms,
    internalNotes: "",
  });

  // Calculated values
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    cgst: 0,
    sgst: 0,
    total: 0,
  });

  useEffect(() => {
    fetchClients();
    if (isEditMode) {
      fetchInvoice();
    }
  }, [id]);

  useEffect(() => {
    if (formData.client) {
      fetchClientProjects(formData.client);
    }
  }, [formData.client]);

  useEffect(() => {
    calculateTotals();
  }, [
    formData.items,
    formData.discount,
    formData.discountType,
    formData.taxRate,
  ]);

  const fetchClients = async () => {
    try {
      const response = await clientService.getClients({ limit: 100 });
      setClients(response.data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  const fetchClientProjects = async (clientId) => {
    try {
      const response = await projectService.getProjects({
        client: clientId,
        limit: 50,
      });
      setProjects(response.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getInvoice(id);
      const invoice = response.data;

      setFormData({
        ...formData,
        ...invoice,
        client: invoice.client?._id || "",
        project: invoice.project?._id || "",
        invoiceDate: invoice.invoiceDate
          ? invoice.invoiceDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
        dueDate: invoice.dueDate ? invoice.dueDate.split("T")[0] : "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch invoice");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    let discountAmount = 0;
    if (formData.discount > 0) {
      discountAmount =
        formData.discountType === "percentage"
          ? subtotal * (formData.discount / 100)
          : formData.discount;
    }

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (formData.taxRate / 100);
    const cgst = taxAmount / 2;
    const sgst = taxAmount / 2;
    const total = afterDiscount + taxAmount;

    setCalculations({
      subtotal,
      discountAmount,
      taxAmount,
      cgst,
      sgst,
      total,
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleItemsChange = (items) => {
    setFormData((prev) => ({
      ...prev,
      items,
    }));
  };

  const handleClientSelect = (clientId) => {
    const client = clients.find((c) => c._id === clientId);
    if (client) {
      setFormData((prev) => ({
        ...prev,
        client: clientId,
        billingAddress: {
          name: client.clientName,
          company: client.businessName || "",
          address: client.address || "",
          email: client.email || "",
          phone: client.phone || "",
          gstin: client.gstin || "",
        },
      }));
    } else {
      handleChange("client", clientId);
    }
  };

  const validateForm = async () => {
    const { isValid, errors: validationErrors } = await validateSchema(
      invoiceSchema,
      formData
    );

    if (!isValid) {
      const messages = Object.values(validationErrors).filter(Boolean);
      setError(messages.join(" | "));
      return false;
    }

    return true;
  };

  const handleSubmit = async (status = "draft") => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setSaving(true);
      setError("");

      const dataToSubmit = {
        ...formData,
        status,
        subtotal: calculations.subtotal,
        discountAmount: calculations.discountAmount,
        taxAmount: calculations.taxAmount,
        cgst: calculations.cgst,
        sgst: calculations.sgst,
        total: calculations.total,
        balanceDue: calculations.total,
      };

      if (isEditMode) {
        await invoiceService.updateInvoice(id, dataToSubmit);
      } else {
        await invoiceService.createInvoice(dataToSubmit);
      }

      navigate("/invoices");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save invoice");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/invoices")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2"
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
            Back to Invoices
          </button>
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? "Edit Invoice" : "Create Invoice"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleSubmit("draft")}
            loading={saving}
          >
            Save Draft
          </Button>
          <Button
            variant="neon"
            onClick={() => handleSubmit("draft")}
            loading={saving}
          >
            Save Invoice
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card title="Invoice Details" subtitle="Basic invoice information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Client <span className="text-neon-green">*</span>
                </label>
                <select
                  value={formData.client}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.businessName || client.clientName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project (Optional)
                </label>
                <select
                  value={formData.project}
                  onChange={(e) => handleChange("project", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                  disabled={!formData.client}
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Invoice Date"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleChange("invoiceDate", e.target.value)}
              />

              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                required
              />
            </div>
          </Card>

          {/* Billing Address */}
          <Card title="Billing Address" subtitle="Client billing information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                placeholder="Contact name"
                value={formData.billingAddress.name}
                onChange={(e) =>
                  handleNestedChange("billingAddress", "name", e.target.value)
                }
              />
              <Input
                label="Company"
                placeholder="Company name"
                value={formData.billingAddress.company}
                onChange={(e) =>
                  handleNestedChange(
                    "billingAddress",
                    "company",
                    e.target.value
                  )
                }
              />
              <Input
                label="Email"
                type="email"
                placeholder="Email address"
                value={formData.billingAddress.email}
                onChange={(e) =>
                  handleNestedChange("billingAddress", "email", e.target.value)
                }
              />
              <Input
                label="Phone"
                placeholder="Phone number"
                value={formData.billingAddress.phone}
                onChange={(e) =>
                  handleNestedChange("billingAddress", "phone", e.target.value)
                }
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.billingAddress.address}
                  onChange={(e) =>
                    handleNestedChange(
                      "billingAddress",
                      "address",
                      e.target.value
                    )
                  }
                  placeholder="Street address, city, state, zip"
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                />
              </div>
              <Input
                label="GSTIN"
                placeholder="GST Number"
                value={formData.billingAddress.gstin}
                onChange={(e) =>
                  handleNestedChange("billingAddress", "gstin", e.target.value)
                }
              />
            </div>
          </Card>

          {/* Invoice Items */}
          <Card title="Invoice Items" subtitle="Add products or services">
            <InvoiceItems items={formData.items} onChange={handleItemsChange} />
          </Card>

          {/* Pricing */}
          <Card title="Pricing" subtitle="Discount and tax settings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discount
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) =>
                      handleChange("discount", Number(e.target.value))
                    }
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                  />
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      handleChange("discountType", e.target.value)
                    }
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">₹</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tax Rate (GST)
                </label>
                <select
                  value={formData.taxRate}
                  onChange={(e) =>
                    handleChange("taxRate", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                >
                  {taxRates.map((rate) => (
                    <option key={rate.id} value={rate.id}>
                      {rate.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Bank Details */}
          <Card title="Bank Details" subtitle="Payment information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Bank Name"
                placeholder="Bank name"
                value={formData.bankDetails.bankName}
                onChange={(e) =>
                  handleNestedChange("bankDetails", "bankName", e.target.value)
                }
              />
              <Input
                label="Account Name"
                placeholder="Account holder name"
                value={formData.bankDetails.accountName}
                onChange={(e) =>
                  handleNestedChange(
                    "bankDetails",
                    "accountName",
                    e.target.value
                  )
                }
              />
              <Input
                label="Account Number"
                placeholder="Account number"
                value={formData.bankDetails.accountNumber}
                onChange={(e) =>
                  handleNestedChange(
                    "bankDetails",
                    "accountNumber",
                    e.target.value
                  )
                }
              />
              <Input
                label="IFSC Code"
                placeholder="IFSC code"
                value={formData.bankDetails.ifscCode}
                onChange={(e) =>
                  handleNestedChange("bankDetails", "ifscCode", e.target.value)
                }
              />
              <Input
                label="Branch"
                placeholder="Branch name"
                value={formData.bankDetails.branch}
                onChange={(e) =>
                  handleNestedChange("bankDetails", "branch", e.target.value)
                }
              />
              <Input
                label="UPI ID"
                placeholder="UPI ID"
                value={formData.bankDetails.upiId}
                onChange={(e) =>
                  handleNestedChange("bankDetails", "upiId", e.target.value)
                }
              />
            </div>
          </Card>

          {/* Notes & Terms */}
          <Card title="Notes & Terms" subtitle="Additional information">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (visible to client)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Add any notes..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => handleChange("terms", e.target.value)}
                  placeholder="Terms and conditions..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Internal Notes (not visible to client)
                </label>
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) =>
                    handleChange("internalNotes", e.target.value)
                  }
                  placeholder="Internal notes..."
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">
              Invoice Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">
                  {formatCurrency(calculations.subtotal)}
                </span>
              </div>

              {calculations.discountAmount > 0 && (
                <div className="flex justify-between text-neon-green">
                  <span>
                    Discount{" "}
                    {formData.discountType === "percentage"
                      ? `(${formData.discount}%)`
                      : ""}
                  </span>
                  <span>-{formatCurrency(calculations.discountAmount)}</span>
                </div>
              )}

              {formData.taxRate > 0 && (
                <>
                  <div className="flex justify-between text-gray-400">
                    <span>CGST ({formData.taxRate / 2}%)</span>
                    <span className="text-white">
                      {formatCurrency(calculations.cgst)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>SGST ({formData.taxRate / 2}%)</span>
                    <span className="text-white">
                      {formatCurrency(calculations.sgst)}
                    </span>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-white">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-neon-green">
                    {formatCurrency(calculations.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowPreview(true)}
              >
                Preview Invoice
              </Button>
              <Button
                variant="neon"
                fullWidth
                onClick={() => handleSubmit("draft")}
                loading={saving}
              >
                Save Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Invoice Preview"
        size="xl"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <InvoicePreview
            invoice={{
              ...formData,
              invoiceNumber: "INV-PREVIEW",
              ...calculations,
            }}
            showActions={true}
          />
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceForm;
