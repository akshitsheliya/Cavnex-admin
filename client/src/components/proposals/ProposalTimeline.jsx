import React from "react";

const ProposalTimeline = ({ data }) => {
  const formatDate = (date) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const milestones = data?.milestones || [
    {
      title: "Discovery & Planning",
      duration: "1 week",
      deliverables: [
        "Requirements gathering",
        "Project plan",
        "Technical specifications",
      ],
    },
    {
      title: "Design Phase",
      duration: "2 weeks",
      deliverables: ["Wireframes", "UI/UX designs", "Design approval"],
    },
    {
      title: "Development",
      duration: "4 weeks",
      deliverables: [
        "Frontend development",
        "Backend development",
        "Integration",
      ],
    },
    {
      title: "Testing & QA",
      duration: "1 week",
      deliverables: [
        "Bug fixes",
        "Performance testing",
        "User acceptance testing",
      ],
    },
    {
      title: "Launch & Deployment",
      duration: "1 week",
      deliverables: ["Deployment", "Training", "Documentation"],
    },
  ];

  return (
    <div className="proposal-section p-8">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
          04
        </span>
        Project Timeline
      </h2>

      {/* Duration Summary */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <p className="text-sm text-gray-500">Start Date</p>
          <p className="text-lg font-semibold text-white">
            {formatDate(data?.startDate)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/20 text-center">
          <p className="text-sm text-gray-500">Total Duration</p>
          <p className="text-lg font-semibold text-neon-green">
            {data?.totalDuration || "8-10 weeks"}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <p className="text-sm text-gray-500">End Date</p>
          <p className="text-lg font-semibold text-white">
            {formatDate(data?.endDate)}
          </p>
        </div>
      </div>

      {/* Timeline Visual */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-green via-neon-blue to-purple-500" />

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative pl-16">
              {/* Node */}
              <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-black border-2 border-neon-green flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-neon-green" />
              </div>

              {/* Content */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-neon-green/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-neon-green font-medium">
                      Phase {index + 1}
                    </span>
                    <h4 className="text-lg font-semibold text-white">
                      {milestone.title}
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-400">
                    {milestone.duration}
                  </span>
                </div>

                {milestone.deliverables &&
                  milestone.deliverables.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">
                        Deliverables:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.deliverables.map((deliverable, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-300"
                          >
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalTimeline;
