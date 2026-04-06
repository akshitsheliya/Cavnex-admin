import React, { useState } from "react";
import { Modal, DatePicker, Input, message } from "antd";
import dayjs from "dayjs";
import Button from "../common/Button";

const { TextArea } = Input;

const ReminderDisplay = ({
  reminder,
  leadId,
  onStatusChange,
  onDelete,
  onEdit,
  loading = false,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    date: null,
    note: "",
  });
  const [saving, setSaving] = useState(false);

  // No reminder state
  if (!reminder || !reminder.date) {
    return (
      <div className="p-6 rounded-xl bg-white/[0.02] border border-dashed border-white/10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 font-medium">No Reminder Set</p>
            <p className="text-gray-500 text-xs mt-1">
              Set a reminder to follow up on this lead
            </p>
          </div>
          {onEdit && (
            <button
              onClick={() => {
                setEditData({ date: null, note: "" });
                setShowEditModal(true);
              }}
              className="mt-2 px-4 py-2 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-medium hover:bg-neon-green/20 transition-colors flex items-center gap-2"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Reminder
            </button>
          )}
        </div>

        {/* Edit/Add Modal */}
        <ReminderModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          editData={editData}
          setEditData={setEditData}
          onSave={async () => {
            if (onEdit && editData.date) {
              setSaving(true);
              try {
                await onEdit({
                  date: editData.date.format("YYYY-MM-DD"),
                  note: editData.note,
                });
                setShowEditModal(false);
              } finally {
                setSaving(false);
              }
            }
          }}
          saving={saving}
          isNew={true}
        />
      </div>
    );
  }

  // Calculate reminder status
  const reminderDate = new Date(reminder.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reminderDateNorm = new Date(reminderDate);
  reminderDateNorm.setHours(0, 0, 0, 0);

  const isOverdue = reminderDateNorm < today && reminder.status === "pending";
  const isToday =
    reminderDateNorm.getTime() === today.getTime() &&
    reminder.status === "pending";
  const isCompleted = reminder.status === "completed";
  const isDismissed = reminder.status === "dismissed";

  const getStatusConfig = () => {
    if (isCompleted) {
      return {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        icon: "text-green-400",
        badge: "bg-green-500/20 text-green-400 border-green-500/30",
        label: "Completed",
        iconBg: "bg-green-500/20",
      };
    }
    if (isDismissed) {
      return {
        bg: "bg-gray-500/10",
        border: "border-gray-500/30",
        icon: "text-gray-400",
        badge: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        label: "Dismissed",
        iconBg: "bg-gray-500/20",
      };
    }
    if (isOverdue) {
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        icon: "text-red-400",
        badge: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
        label: "Overdue",
        iconBg: "bg-red-500/20",
      };
    }
    if (isToday) {
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        icon: "text-amber-400",
        badge:
          "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse",
        label: "Today",
        iconBg: "bg-amber-500/20",
      };
    }
    return {
      bg: "bg-neon-blue/10",
      border: "border-neon-blue/30",
      icon: "text-neon-blue",
      badge: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
      label: "Upcoming",
      iconBg: "bg-neon-blue/20",
    };
  };

  const config = getStatusConfig();

  const handleEdit = () => {
    const dateStr = reminder.date ? reminder.date.split("T")[0] : "";
    setEditData({
      date: dateStr ? dayjs(dateStr) : null,
      note: reminder.note || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (onEdit && editData.date) {
      setSaving(true);
      try {
        await onEdit({
          date: editData.date.format("YYYY-MM-DD"),
          note: editData.note,
        });
        setShowEditModal(false);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <>
      <div className={`p-5 rounded-xl ${config.bg} border ${config.border}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}
            >
              <svg
                className={`w-5 h-5 ${config.icon}`}
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
            </div>
            <div>
              <span className="text-sm font-semibold text-white">Reminder</span>
              <span
                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badge}`}
              >
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-4">
          {/* Date */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20">
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-white text-sm font-medium">
              {new Date(reminder.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Note */}
          {reminder.note && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <p className="text-gray-300 text-sm">{reminder.note}</p>
            </div>
          )}
        </div>

        {/* Actions for Pending */}
        {reminder.status === "pending" && (
          <div className="flex items-center gap-2 pt-4 border-t border-white/10">
            <button
              onClick={() => onStatusChange && onStatusChange("completed")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
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
              Done
            </button>
            <button
              onClick={() => onStatusChange && onStatusChange("dismissed")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-500/10 border border-gray-500/30 text-gray-400 text-sm font-medium hover:bg-gray-500/20 transition-colors disabled:opacity-50"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Dismiss
            </button>
            {onEdit && (
              <button
                onClick={handleEdit}
                disabled={loading}
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                title="Edit Reminder"
              >
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Actions for Completed/Dismissed */}
        {(isCompleted || isDismissed) && (
          <div className="flex items-center gap-2 pt-4 border-t border-white/10">
            <button
              onClick={() => onStatusChange && onStatusChange("pending")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-sm font-medium hover:bg-neon-blue/20 transition-colors disabled:opacity-50"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reactivate
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                disabled={loading}
                className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                title="Delete Reminder"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <ReminderModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        editData={editData}
        setEditData={setEditData}
        onSave={handleSaveEdit}
        saving={saving}
        isNew={false}
      />
    </>
  );
};

// Separate Modal Component
const ReminderModal = ({
  open,
  onClose,
  editData,
  setEditData,
  onSave,
  saving,
  isNew,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <span className="text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-neon-green"
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
          {isNew ? "Set Reminder" : "Edit Reminder"}
        </span>
      }
      footer={null}
      className="custom-reminder-modal"
      centered
      width={450}
      destroyOnClose
    >
      <div className="py-4 space-y-5">
        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reminder Date <span className="text-neon-green">*</span>
          </label>
          <DatePicker
            value={editData.date}
            onChange={(date) => setEditData({ ...editData, date })}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            className="custom-datepicker w-full"
            format="DD MMM YYYY"
            placeholder="Select date"
            size="large"
            popupClassName="custom-datepicker-dropdown"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Note <span className="text-gray-500">(Optional)</span>
          </label>
          <TextArea
            value={editData.note}
            onChange={(e) => setEditData({ ...editData, note: e.target.value })}
            rows={4}
            maxLength={500}
            placeholder="Add a note for this reminder..."
            className="custom-textarea"
            showCount
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!editData.date || saving}
            className="flex-1 px-4 py-3 rounded-xl bg-neon-green/20 border border-neon-green/30 text-neon-green font-medium hover:bg-neon-green/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : isNew ? "Set Reminder" : "Save Changes"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-reminder-modal .ant-modal-content {
          background: #1a1a2e !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
        }
        .custom-reminder-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          padding: 16px 24px !important;
        }
        .custom-reminder-modal .ant-modal-body {
          padding: 0 24px 24px !important;
        }
        .custom-reminder-modal .ant-modal-title {
          color: white !important;
        }
        .custom-reminder-modal .ant-modal-close-x {
          color: #9ca3af !important;
        }
        .custom-datepicker {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
        }
        .custom-datepicker .ant-picker-input > input {
          color: white !important;
        }
        .custom-datepicker .ant-picker-input > input::placeholder {
          color: #6b7280 !important;
        }
        .custom-datepicker .ant-picker-suffix,
        .custom-datepicker .ant-picker-clear {
          color: #9ca3af !important;
        }
        .custom-datepicker:hover,
        .custom-datepicker-focused {
          border-color: rgba(0, 255, 136, 0.5) !important;
        }
        .custom-datepicker-dropdown .ant-picker-panel {
          background: #1a1a2e !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .custom-datepicker-dropdown .ant-picker-header,
        .custom-datepicker-dropdown .ant-picker-content th,
        .custom-datepicker-dropdown .ant-picker-cell {
          color: white !important;
        }
        .custom-datepicker-dropdown
          .ant-picker-cell-in-view.ant-picker-cell-selected
          .ant-picker-cell-inner {
          background: #00ff88 !important;
          color: #000 !important;
        }
        .custom-datepicker-dropdown
          .ant-picker-cell:hover
          .ant-picker-cell-inner {
          background: rgba(0, 255, 136, 0.2) !important;
        }
        .custom-textarea {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          color: white !important;
          resize: none !important;
        }
        .custom-textarea::placeholder {
          color: #6b7280 !important;
        }
        .custom-textarea:hover,
        .custom-textarea:focus {
          border-color: rgba(0, 255, 136, 0.5) !important;
        }
        .custom-textarea .ant-input-data-count {
          color: #6b7280 !important;
        }
      `}</style>
    </Modal>
  );
};

export default ReminderDisplay;
