import React, { useState } from "react";
import DateInput from "../common/DateInput";

const ReminderInput = ({
  value = { date: "", note: "" },
  onChange,
  minDate,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!!value.date);

  const handleDateChange = (date) => {
    onChange({ ...value, date });
    if (date && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleNoteChange = (e) => {
    onChange({ ...value, note: e.target.value });
  };

  const handleClear = () => {
    onChange({ date: "", note: "" });
    setIsExpanded(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span>Set Reminder</span>
          </div>
        </label>
        {value.date && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear Reminder
          </button>
        )}
      </div>

      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-2">
            Reminder Date
          </label>
          <DateInput
            value={value.date}
            onChange={handleDateChange}
            min={minDate || today}
            placeholder="Select reminder date"
            disabled={disabled}
            className="w-full"
          />
        </div>

        {(isExpanded || value.date) && (
          <div className="animate-fadeIn">
            <label className="block text-xs text-gray-500 mb-2">
              Reminder Note (Optional)
            </label>
            <textarea
              value={value.note || ""}
              onChange={handleNoteChange}
              disabled={disabled}
              placeholder="E.g., Follow up about pricing, Schedule demo call..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-neon-green/50 focus:bg-white/[0.06] transition-all duration-300 resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                {value.note?.length || 0}/500 characters
              </span>
              {value.date && (
                <span className="text-xs text-amber-400">
                  Reminder set for{" "}
                  {new Date(value.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        )}

        {!value.date && (
          <p className="text-xs text-gray-500">
            Set a reminder to follow up with this lead on a specific date
          </p>
        )}
      </div>
    </div>
  );
};

export default ReminderInput;
