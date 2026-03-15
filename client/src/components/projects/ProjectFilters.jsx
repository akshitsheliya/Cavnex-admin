import React from "react";
import Input from "../common/Input";

const ProjectFilters = ({ filters, onFilterChange, onReset }) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "planning", label: "Planning" },
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
    { value: "testing", label: "Testing" },
    { value: "review", label: "Review" },
    { value: "completed", label: "Completed" },
    { value: "on_hold", label: "On Hold" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "website", label: "Website" },
    { value: "webapp", label: "Web App" },
    { value: "mobileapp", label: "Mobile App" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "custom", label: "Custom" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search projects..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            icon={
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>

        <select
          value={filters.status || ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50 min-w-[140px]"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.projectType || ""}
          onChange={(e) => onFilterChange("projectType", e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50 min-w-[140px]"
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.priority || ""}
          onChange={(e) => onFilterChange("priority", e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50 min-w-[140px]"
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={onReset}
          className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProjectFilters;
