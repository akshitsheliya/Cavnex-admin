import React from "react";

const ProposalCover = ({ data, companyInfo, template = "modern" }) => {
  const formatDate = (date) => {
    if (!date)
      return new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="proposal-cover min-h-[800px] bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden p-12 flex flex-col justify-between">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          {companyInfo?.logo ? (
            <img src={companyInfo.logo} alt="Logo" className="h-16" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
              <span className="text-2xl font-bold text-black">
                {companyInfo?.companyName?.charAt(0) || "A"}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white">
              {companyInfo?.companyName || "Your Agency"}
            </h2>
            {companyInfo?.tagline && (
              <p className="text-gray-400">{companyInfo.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <p className="text-neon-green text-sm font-medium tracking-wider uppercase mb-4">
          Project Proposal
        </p>
        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {data?.title || "Project Proposal"}
        </h1>
        <div className="h-1 w-32 bg-gradient-to-r from-neon-green to-neon-blue rounded-full mb-8" />
        <p className="text-xl text-gray-400 max-w-2xl">
          A comprehensive proposal outlining our approach, timeline, and
          investment for your project.
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
        <div>
          <p className="text-sm text-gray-500 mb-1">Prepared For</p>
          <p className="text-xl font-semibold text-white">
            {data?.preparedFor || "Client Name"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Date</p>
          <p className="text-xl font-semibold text-white">
            {formatDate(data?.date)}
          </p>
        </div>
      </div>

      {/* Proposal number */}
      <div className="absolute bottom-4 right-4 text-sm text-gray-600">
        {data?.proposalNumber}
      </div>
    </div>
  );
};

export default ProposalCover;
