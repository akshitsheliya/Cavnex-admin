import React, { useRef } from "react";
import ProposalCover from "./ProposalCover";
import ProposalOverview from "./ProposalOverview";
import ProposalScope from "./ProposalScope";
import ProposalFeatures from "./ProposalFeatures";
import ProposalTimeline from "./ProposalTimeline";
import ProposalPricing from "./ProposalPricing";
import ProposalTerms from "./ProposalTerms";
import Button from "../common/Button";

const ProposalPreview = ({ proposal, onDownloadPDF, onSendProposal }) => {
  const previewRef = useRef(null);

  if (!proposal) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No proposal data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10 sticky top-0 z-10 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold text-white">{proposal.title}</h2>
          <p className="text-sm text-gray-400">{proposal.proposalNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onDownloadPDF}>
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </Button>
          <Button variant="neon" onClick={onSendProposal}>
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Send Proposal
          </Button>
        </div>
      </div>

      {/* Proposal Preview */}
      <div
        ref={previewRef}
        className="proposal-preview bg-black rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Cover Page */}
        <ProposalCover
          data={{
            title: proposal.title,
            preparedFor: proposal.coverPage?.preparedFor,
            date: proposal.coverPage?.date,
            proposalNumber: proposal.proposalNumber,
          }}
          companyInfo={proposal.coverPage}
        />

        {/* Page Break */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Overview */}
        <ProposalOverview data={proposal.overview} />

        {/* Page Break */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Scope */}
        <ProposalScope data={proposal.scope} />

        {/* Page Break */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Features */}
        <ProposalFeatures
          features={proposal.features}
          projectType={proposal.projectType}
        />

        {/* Page Break */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Timeline */}
        <ProposalTimeline data={proposal.timeline} />

        {/* Page Break */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Pricing */}
        <ProposalPricing pricing={proposal.pricing} />

        {/* Page Break */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Terms */}
        <ProposalTerms
          paymentTerms={proposal.paymentTerms}
          termsAndConditions={proposal.termsAndConditions}
        />

        {/* Footer */}
        <div className="p-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            This proposal is valid until{" "}
            {proposal.validUntil
              ? new Date(proposal.validUntil).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "30 days from the date of issue"}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="w-32 h-px bg-white/10" />
            <span className="text-gray-600 text-sm">Thank You</span>
            <div className="w-32 h-px bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalPreview;
