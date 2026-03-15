import React from "react";

const ProjectTimeline = ({ project }) => {
  const stages = [
    { key: "planning", label: "Planning", icon: "📋" },
    { key: "design", label: "Design", icon: "🎨" },
    { key: "development", label: "Development", icon: "💻" },
    { key: "testing", label: "Testing", icon: "🧪" },
    { key: "review", label: "Review", icon: "👀" },
    { key: "completed", label: "Completed", icon: "✅" },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === project.status);

  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-neon-green to-neon-blue transition-all duration-500"
        style={{
          width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 100)}%`,
        }}
      />

      <div className="relative flex justify-between">
        {stages.map((stage, index) => {
          const isPast = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isFuture = index > currentStageIndex;

          return (
            <div key={stage.key} className="flex flex-col items-center">
              <div
                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                                    transition-all duration-300 z-10
                                    ${
                                      isPast
                                        ? "bg-neon-green text-black shadow-[0_0_20px_rgba(0,255,136,0.5)]"
                                        : isCurrent
                                          ? "bg-gradient-to-r from-neon-green to-neon-blue text-black shadow-[0_0_20px_rgba(0,255,136,0.3)] animate-pulse"
                                          : "bg-white/10 text-gray-500"
                                    }
                                `}
              >
                {stage.icon}
              </div>
              <span
                className={`
                                    mt-2 text-xs font-medium
                                    ${isPast || isCurrent ? "text-white" : "text-gray-500"}
                                `}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTimeline;
