import React from "react";

const AgreementPreview = ({
  agreement,
  showActions = false,
  onDownload,
  onSend,
}) => {
  if (!agreement) return null;

  const { dynamicFields, companyInfo, sections, signatures } = agreement;

  // Helper function to format address (handles both string and object)
  const formatAddress = (address) => {
    if (!address) return "N/A";

    // If address is a string, return it directly
    if (typeof address === "string") {
      return address;
    }

    // If address is an object, format it
    if (typeof address === "object") {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.country,
        address.pincode,
      ].filter(Boolean);

      return parts.length > 0 ? parts.join(", ") : "N/A";
    }

    return "N/A";
  };

  // Helper function to safely render any value
  const safeRender = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") {
      // If it's an address object, format it
      if (value.street || value.city || value.state) {
        return formatAddress(value);
      }
      // For other objects, convert to string
      return JSON.stringify(value);
    }
    return String(value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: dynamicFields?.currency || "INR",
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

  return (
    <div className="bg-white text-black p-8 rounded-xl">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
          {agreement.title || "Software Development Agreement"}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Agreement No: {agreement.agreementNumber || "N/A"}
        </p>
        <p className="text-sm text-gray-500">
          Effective Date: {formatDate(agreement.effectiveDate)}
        </p>
      </div>

      {/* Parties Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          PARTIES TO THE AGREEMENT
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Provider */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              SERVICE PROVIDER (First Party)
            </h3>
            <p className="font-medium">{companyInfo?.name || "Company Name"}</p>
            <p className="text-sm text-gray-600">
              {safeRender(companyInfo?.address)}
            </p>
            <p className="text-sm text-gray-600">
              Email: {companyInfo?.email || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Phone: {companyInfo?.phone || "N/A"}
            </p>
            {companyInfo?.gstin && (
              <p className="text-sm text-gray-600">
                GSTIN: {companyInfo.gstin}
              </p>
            )}
          </div>

          {/* Client */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              CLIENT (Second Party)
            </h3>
            <p className="font-medium">
              {dynamicFields?.clientName || "Client Name"}
            </p>
            {dynamicFields?.businessName && (
              <p className="text-sm text-gray-600">
                {dynamicFields.businessName}
              </p>
            )}
            <p className="text-sm text-gray-600">
              {formatAddress(dynamicFields?.clientAddress)}
            </p>
            <p className="text-sm text-gray-600">
              Email: {dynamicFields?.clientEmail || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Phone: {dynamicFields?.clientPhone || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          PROJECT DETAILS
        </h2>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Project Name</p>
            <p className="font-medium">{dynamicFields?.projectName || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Timeline</p>
            <p className="font-medium">{dynamicFields?.timeline || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">
              {formatDate(dynamicFields?.startDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">{formatDate(dynamicFields?.endDate)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Contract Value</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(dynamicFields?.price)}
            </p>
          </div>
        </div>

        {dynamicFields?.projectDescription && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Project Description</p>
            <p className="text-gray-700">{dynamicFields.projectDescription}</p>
          </div>
        )}
      </div>

      {/* Payment Schedule */}
      {dynamicFields?.paymentSchedule &&
        dynamicFields.paymentSchedule.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              PAYMENT SCHEDULE
            </h2>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 text-sm font-semibold">
                    Milestone
                  </th>
                  <th className="text-center p-3 text-sm font-semibold">
                    Percentage
                  </th>
                  <th className="text-right p-3 text-sm font-semibold">
                    Amount
                  </th>
                  <th className="text-right p-3 text-sm font-semibold">Due</th>
                </tr>
              </thead>
              <tbody>
                {dynamicFields.paymentSchedule.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-3">{payment.milestone}</td>
                    <td className="p-3 text-center">{payment.percentage}%</td>
                    <td className="p-3 text-right">
                      {formatCurrency(
                        (dynamicFields.price * payment.percentage) / 100
                      )}
                    </td>
                    <td className="p-3 text-right text-sm text-gray-600">
                      {payment.dueDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {/* Agreement Sections */}
      {sections && Object.keys(sections).length > 0 && (
        <div className="mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <div key={key} className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                {section.title || key.replace(/([A-Z])/g, " $1").toUpperCase()}
              </h2>

              {section.content && (
                <p className="text-gray-700 whitespace-pre-line mb-3">
                  {section.content}
                </p>
              )}

              {section.items && section.items.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {section.items.map((item, index) => (
                    <li key={index}>{safeRender(item)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Signatures */}
      <div className="mt-12 pt-8 border-t-2 border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
          SIGNATURES
        </h2>

        <div className="grid grid-cols-2 gap-12">
          {/* Company Signature */}
          <div className="text-center">
            <div className="h-20 border-b-2 border-gray-400 mb-2"></div>
            <p className="font-semibold">
              {signatures?.company?.name ||
                companyInfo?.name ||
                "Authorized Signatory"}
            </p>
            <p className="text-sm text-gray-500">
              {signatures?.company?.designation || "Director"}
            </p>
            <p className="text-sm text-gray-500">
              {companyInfo?.name || "Service Provider"}
            </p>
            <p className="text-sm text-gray-400 mt-2">Date: ____________</p>
          </div>

          {/* Client Signature */}
          <div className="text-center">
            <div className="h-20 border-b-2 border-gray-400 mb-2"></div>
            <p className="font-semibold">
              {signatures?.client?.name ||
                dynamicFields?.clientName ||
                "Client Name"}
            </p>
            <p className="text-sm text-gray-500">
              {signatures?.client?.designation || "Authorized Representative"}
            </p>
            <p className="text-sm text-gray-500">
              {dynamicFields?.businessName || "Client"}
            </p>
            <p className="text-sm text-gray-400 mt-2">Date: ____________</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center gap-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Print Agreement
          </button>
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Download PDF
            </button>
          )}
          {onSend && (
            <button
              onClick={onSend}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send to Client
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AgreementPreview;
