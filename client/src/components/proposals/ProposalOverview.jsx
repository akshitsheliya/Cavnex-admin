import React from "react";

const ProposalOverview = ({ data }) => {
  return (
    <div className="proposal-section p-8">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center text-neon-green">
          01
        </span>
        Project Overview
      </h2>

      {/* Introduction */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-3">Introduction</h3>
        <p className="text-gray-300 leading-relaxed">
          {data?.introduction ||
            "We are excited to present this proposal for your project. Our team has carefully analyzed your requirements and prepared a comprehensive plan to deliver a solution that exceeds your expectations."}
        </p>
      </div>

      {/* Objectives */}
      {data?.objectives && data.objectives.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">
            Project Objectives
          </h3>
          <div className="grid gap-3">
            {data.objectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-neon-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-300">{objective}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {data?.challenges && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">
            Understanding Your Challenges
          </h3>
          <p className="text-gray-300 leading-relaxed">{data.challenges}</p>
        </div>
      )}

      {/* Solution */}
      {data?.solution && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border border-neon-green/20">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Our Solution
          </h3>
          <p className="text-gray-300 leading-relaxed">{data.solution}</p>
        </div>
      )}
    </div>
  );
};

export default ProposalOverview;
