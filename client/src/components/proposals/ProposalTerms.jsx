import React from "react";

const ProposalTerms = ({ paymentTerms, termsAndConditions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const terms = paymentTerms?.terms || [
    { milestone: "Project Kickoff", percentage: 40, dueDate: "Upon signing" },
    {
      milestone: "Design Approval",
      percentage: 30,
      dueDate: "After design completion",
    },
    {
      milestone: "Project Completion",
      percentage: 30,
      dueDate: "Upon final delivery",
    },
  ];

  const conditions = termsAndConditions || [
    {
      title: "Intellectual Property",
      content: "All work becomes property of the client upon full payment.",
    },
    {
      title: "Revisions",
      content: "Two rounds of revisions are included per milestone.",
    },
    {
      title: "Warranty",
      content: "30-day bug fix warranty after project completion.",
    },
  ];

  return (
    <div className="proposal-section p-8">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
          06
        </span>
        Payment Terms
      </h2>

      {/* Payment Schedule */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Payment Schedule
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  Milestone
                </th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">
                  Percentage
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">
                  Amount
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">
                  Due
                </th>
              </tr>
            </thead>
            <tbody>
              {terms.map((term, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-4 px-4 text-white">{term.milestone}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm font-medium">
                      {term.percentage}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-white font-medium">
                    {term.amount ? formatCurrency(term.amount) : "-"}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-400">
                    {term.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      {paymentTerms?.paymentMethods &&
        paymentTerms.paymentMethods.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Accepted Payment Methods
            </h3>
            <div className="flex flex-wrap gap-3">
              {paymentTerms.paymentMethods.map((method, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Bank Details */}
      {paymentTerms?.bankDetails && (
        <div className="mb-8 p-6 rounded-xl bg-white/[0.02] border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">
            Bank Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Bank Name</p>
              <p className="text-white">{paymentTerms.bankDetails.bankName}</p>
            </div>
            <div>
              <p className="text-gray-500">Account Name</p>
              <p className="text-white">
                {paymentTerms.bankDetails.accountName}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Account Number</p>
              <p className="text-white font-mono">
                {paymentTerms.bankDetails.accountNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-500">IFSC Code</p>
              <p className="text-white font-mono">
                {paymentTerms.bankDetails.ifscCode}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Terms & Conditions
        </h3>
        <div className="space-y-4">
          {conditions.map((condition, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <h4 className="font-medium text-white mb-2">
                {index + 1}. {condition.title}
              </h4>
              <p className="text-sm text-gray-400">{condition.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalTerms;
