import React from "react";

const InvoicePreview = ({
  invoice,
  showActions = false,
  onDownload,
  onPrint,
}) => {
  if (!invoice) return null;

  // Helper function to format address (handles both string and object)
  const formatAddress = (address) => {
    if (!address) return "";

    if (typeof address === "string") {
      return address;
    }

    if (typeof address === "object") {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.country,
        address.pincode || address.zipCode,
      ].filter(Boolean);

      return parts.join(", ");
    }

    return "";
  };

  // Helper to safely render any value
  const safeRender = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
      if (value.street || value.city || value.state) {
        return formatAddress(value);
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: invoice.currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const { billingAddress, companyInfo, items } = invoice;

  return (
    <div className="bg-white text-black p-8 rounded-xl" id="invoice-preview">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-500 mt-1">
            #{invoice.invoiceNumber || "DRAFT"}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-900">
            {companyInfo?.name || "Your Company"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {formatAddress(companyInfo?.address)}
          </p>
          {companyInfo?.city && (
            <p className="text-sm text-gray-600">
              {companyInfo.city}, {companyInfo.state}
            </p>
          )}
          <p className="text-sm text-gray-600">{companyInfo?.email}</p>
          <p className="text-sm text-gray-600">{companyInfo?.phone}</p>
          {companyInfo?.gstin && (
            <p className="text-sm text-gray-600">GSTIN: {companyInfo.gstin}</p>
          )}
        </div>
      </div>

      {/* Invoice Details & Billing */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Bill To */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Bill To
          </h3>
          <p className="font-semibold text-gray-900">
            {billingAddress?.name || billingAddress?.company || "Client Name"}
          </p>
          {billingAddress?.company && billingAddress?.name && (
            <p className="text-gray-600">{billingAddress.company}</p>
          )}
          <p className="text-gray-600">
            {formatAddress(billingAddress?.address)}
          </p>
          {billingAddress?.city && (
            <p className="text-gray-600">
              {billingAddress.city}, {billingAddress.state}{" "}
              {billingAddress.zipCode}
            </p>
          )}
          <p className="text-gray-600">{billingAddress?.email}</p>
          <p className="text-gray-600">{billingAddress?.phone}</p>
          {billingAddress?.gstin && (
            <p className="text-gray-600">GSTIN: {billingAddress.gstin}</p>
          )}
        </div>

        {/* Invoice Info */}
        <div className="text-right">
          <div className="inline-block text-left">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <span className="text-gray-500">Invoice Date:</span>
              <span className="font-medium">
                {formatDate(invoice.invoiceDate)}
              </span>

              <span className="text-gray-500">Due Date:</span>
              <span className="font-medium">{formatDate(invoice.dueDate)}</span>

              <span className="text-gray-500">Status:</span>
              <span
                className={`font-medium capitalize ${
                  invoice.status === "paid"
                    ? "text-green-600"
                    : invoice.status === "overdue"
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 text-sm font-semibold">#</th>
              <th className="text-left p-3 text-sm font-semibold">
                Description
              </th>
              <th className="text-center p-3 text-sm font-semibold">Qty</th>
              <th className="text-right p-3 text-sm font-semibold">Rate</th>
              <th className="text-right p-3 text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-3 text-gray-600">{index + 1}</td>
                  <td className="p-3">{item.description}</td>
                  <td className="p-3 text-center">
                    {item.quantity} {item.unit !== "unit" ? item.unit : ""}
                  </td>
                  <td className="p-3 text-right">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(item.amount || item.quantity * item.rate)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-72">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">
              {formatCurrency(invoice.subtotal)}
            </span>
          </div>

          {invoice.discountAmount > 0 && (
            <div className="flex justify-between py-2 text-green-600">
              <span>Discount ({invoice.discount}%):</span>
              <span>-{formatCurrency(invoice.discountAmount)}</span>
            </div>
          )}

          {invoice.taxAmount > 0 && (
            <>
              <div className="flex justify-between py-2 text-gray-600">
                <span>CGST ({invoice.taxRate / 2}%):</span>
                <span>{formatCurrency(invoice.cgst)}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-600">
                <span>SGST ({invoice.taxRate / 2}%):</span>
                <span>{formatCurrency(invoice.sgst)}</span>
              </div>
            </>
          )}

          <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-2">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-lg font-bold">
              {formatCurrency(invoice.total)}
            </span>
          </div>

          {invoice.amountPaid > 0 && (
            <>
              <div className="flex justify-between py-2 text-green-600">
                <span>Amount Paid:</span>
                <span>{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-red-600">
                <span>Balance Due:</span>
                <span>{formatCurrency(invoice.balanceDue)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bank Details */}
      {invoice.bankDetails && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Bank Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {invoice.bankDetails.bankName && (
              <>
                <span className="text-gray-500">Bank:</span>
                <span>{invoice.bankDetails.bankName}</span>
              </>
            )}
            {invoice.bankDetails.accountName && (
              <>
                <span className="text-gray-500">Account Name:</span>
                <span>{invoice.bankDetails.accountName}</span>
              </>
            )}
            {invoice.bankDetails.accountNumber && (
              <>
                <span className="text-gray-500">Account No:</span>
                <span>{invoice.bankDetails.accountNumber}</span>
              </>
            )}
            {invoice.bankDetails.ifscCode && (
              <>
                <span className="text-gray-500">IFSC:</span>
                <span>{invoice.bankDetails.ifscCode}</span>
              </>
            )}
            {invoice.bankDetails.upiId && (
              <>
                <span className="text-gray-500">UPI:</span>
                <span>{invoice.bankDetails.upiId}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Notes & Terms */}
      {invoice.notes && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-sm text-gray-600">{invoice.notes}</p>
        </div>
      )}

      {invoice.terms && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Terms & Conditions</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {invoice.terms}
          </p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center gap-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Print
          </button>
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Download PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
