import React from "react";

const SignatureSection = ({
  signatures,
  companyInfo,
  clientInfo,
  onUpdate,
}) => {
  const formatDate = (date) => {
    if (!date) return "_______________";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mt-12 pt-8 border-t border-white/10">
      <h3 className="text-xl font-semibold text-white mb-8 text-center">
        Signatures
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Company Signature */}
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">
            For {companyInfo?.name || "Developer"}
          </h4>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Authorized Signatory</p>
              <div className="mt-8 border-b border-dashed border-white/30 pb-2">
                {signatures?.company?.signatureImage ? (
                  <img
                    src={signatures.company.signatureImage}
                    alt="Signature"
                    className="h-12"
                  />
                ) : (
                  <div className="h-12" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-white">
                  {signatures?.company?.name || "_______________"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="text-white">
                  {signatures?.company?.designation || "_______________"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-white">
                {formatDate(signatures?.company?.date)}
              </p>
            </div>

            {signatures?.company?.signed && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm">
                <svg
                  className="w-4 h-4"
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
                Signed
              </div>
            )}
          </div>
        </div>

        {/* Client Signature */}
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">
            For {clientInfo?.businessName || clientInfo?.clientName || "Client"}
          </h4>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Authorized Signatory</p>
              <div className="mt-8 border-b border-dashed border-white/30 pb-2">
                {signatures?.client?.signatureImage ? (
                  <img
                    src={signatures.client.signatureImage}
                    alt="Signature"
                    className="h-12"
                  />
                ) : (
                  <div className="h-12" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-white">
                  {signatures?.client?.name ||
                    clientInfo?.clientName ||
                    "_______________"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="text-white">
                  {signatures?.client?.designation || "_______________"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-white">
                {formatDate(signatures?.client?.date)}
              </p>
            </div>

            {signatures?.client?.signed && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm">
                <svg
                  className="w-4 h-4"
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
                Signed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;
