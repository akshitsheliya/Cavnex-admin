import React from "react";

const ProposalScope = ({ data }) => {
  return (
    <div className="proposal-section p-8">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue">
          02
        </span>
        Scope of Work
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* What's Included */}
        <div className="p-6 rounded-2xl bg-neon-green/5 border border-neon-green/20">
          <h3 className="text-lg font-semibold text-neon-green mb-4 flex items-center gap-2">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            What's Included
          </h3>
          <ul className="space-y-3">
            {(
              data?.included || [
                "Custom design and development",
                "Responsive design for all devices",
                "Testing and quality assurance",
                "Deployment and launch support",
                "Documentation and training",
              ]
            ).map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-neon-green mt-1">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What's Not Included */}
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            What's Not Included
          </h3>
          <ul className="space-y-3">
            {(
              data?.excluded || [
                "Third-party integrations not listed",
                "Content creation and copywriting",
                "Stock images and media",
                "Ongoing maintenance (unless selected)",
                "Server hosting and domain",
              ]
            ).map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-red-400 mt-1">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Assumptions */}
      {data?.assumptions && data.assumptions.length > 0 && (
        <div className="mt-6 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Assumptions
          </h3>
          <ul className="space-y-2">
            {data.assumptions.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-amber-400 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProposalScope;
