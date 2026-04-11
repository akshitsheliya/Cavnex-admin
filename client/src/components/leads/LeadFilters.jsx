// LeadFilters.jsx
import React from "react";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const LeadFilters = ({ filters, onFilterChange, onReset }) => {
  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "meeting", label: "Meeting" },
    { value: "proposal_pending", label: "Proposal Pending" },
    { value: "proposal_sent", label: "Proposal Sent" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed_won", label: "Won" },
    { value: "closed_lost", label: "Lost" },
  ];

  const sourceOptions = [
    { value: "website", label: "Website" },
    { value: "instagram", label: "Instagram" },
    { value: "referral", label: "Referral" },
    { value: "google", label: "Google" },
    { value: "cold_call", label: "Cold Call" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="glass-card p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="w-full">
          <Input
            placeholder="Search leads..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="custom-search-input w-full"
            allowClear
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[140px]">
            <Select
              value={filters.status || undefined}
              onChange={(value) => onFilterChange("status", value || "")}
              placeholder="All Status"
              allowClear
              className="custom-filter-select w-full"
              popupClassName="custom-dropdown"
            >
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <Select
              value={filters.source || undefined}
              onChange={(value) => onFilterChange("source", value || "")}
              placeholder="All Sources"
              allowClear
              className="custom-filter-select w-full"
              popupClassName="custom-dropdown"
            >
              {sourceOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          <button
            onClick={onReset}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors whitespace-nowrap flex-shrink-0 border border-white/10"
          >
            Reset
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-search-input {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          height: 2.5rem !important;
        }
        .custom-search-input .ant-input {
          background: transparent !important;
          color: white !important;
        }
        .custom-search-input .ant-input::placeholder {
          color: #6b7280 !important;
        }
        .custom-search-input:hover,
        .custom-search-input:focus-within {
          border-color: rgba(0, 255, 136, 0.5) !important;
        }
        .custom-filter-select .ant-select-selector {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          height: 2.5rem !important;
          padding: 0 0.75rem !important;
        }
        .custom-filter-select .ant-select-selection-item,
        .custom-filter-select .ant-select-selection-placeholder {
          line-height: 2.5rem !important;
          color: white !important;
        }
        .custom-filter-select .ant-select-selection-placeholder {
          color: #9ca3af !important;
        }
        .custom-filter-select:hover .ant-select-selector {
          border-color: rgba(0, 255, 136, 0.5) !important;
        }
        .custom-filter-select .ant-select-arrow,
        .custom-filter-select .ant-select-clear {
          color: #9ca3af !important;
        }
        .custom-dropdown {
          background: #1a1a2e !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
        }
        .custom-dropdown .ant-select-item {
          color: white !important;
        }
        .custom-dropdown .ant-select-item-option-active,
        .custom-dropdown .ant-select-item-option-selected {
          background: rgba(0, 255, 136, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default LeadFilters;
