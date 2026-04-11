// CopyLeadButton.jsx
import React, { useState } from "react";
import { message } from "antd";

const CopyLeadButton = ({ lead }) => {
  const [copied, setCopied] = useState(false);

  const copyLead = () => {
    const leadData = `
Lead Information
================
Name: ${lead.leadName}
Business: ${lead.businessName || "N/A"}
Business Type: ${lead.businessType || "N/A"}
Email: ${lead.email}
Phone: ${lead.phone}
City: ${lead.city || "N/A"}
Source: ${lead.source}
Status: ${lead.status}
Estimated Value: ₹${lead.estimatedValue || 0}
Notes: ${lead.notes || "N/A"}
Created: ${new Date(lead.createdAt).toLocaleDateString()}
    `.trim();

    navigator.clipboard.writeText(leadData);
    setCopied(true);
    message.success("Lead details copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyLead}
      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-neon-green hover:border-neon-green/30 transition-all duration-200 w-full text-sm"
      title="Copy lead details"
    >
      {copied ? (
        <>
          <svg
            className="w-4 h-4 text-neon-green flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-neon-green">Copied!</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 flex-shrink-0"
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
          <span>Copy Details</span>
        </>
      )}
    </button>
  );
};

export default CopyLeadButton;
