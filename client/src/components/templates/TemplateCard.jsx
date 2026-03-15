import React from "react";
import { useNavigate } from "react-router-dom";

const TemplateCard = ({ template, onDelete, onDuplicate }) => {
  const navigate = useNavigate();

  const getTypeConfig = (type) => {
    const config = {
      proposal: { bg: "bg-neon-blue/20", text: "text-neon-blue", icon: "📋" },
      agreement: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        icon: "📜",
      },
      invoice: { bg: "bg-neon-green/20", text: "text-neon-green", icon: "🧾" },
      email: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "📧" },
      custom: { bg: "bg-gray-500/20", text: "text-gray-400", icon: "⚙️" },
    };
    return config[type] || config.custom;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      cover: "Cover Page",
      section: "Section",
      terms: "Terms & Conditions",
      email: "Email",
      full: "Full Document",
      snippet: "Snippet",
    };
    return labels[category] || category;
  };

  const typeConfig = getTypeConfig(template.type);

  return (
    <div
      className="glass-card p-6 hover:border-neon-green/30 transition-all cursor-pointer group"
      onClick={() => navigate(`/templates/${template._id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl ${typeConfig.bg} flex items-center justify-center text-2xl`}
          >
            {typeConfig.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-neon-green transition-colors">
              {template.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.bg} ${typeConfig.text}`}
              >
                {template.type}
              </span>
              <span className="text-xs text-gray-500">
                {getCategoryLabel(template.category)}
              </span>
            </div>
          </div>
        </div>

        {template.isSystem && (
          <span className="px-2 py-1 rounded-full text-xs bg-white/5 text-gray-400">
            System
          </span>
        )}
      </div>

      {template.description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {template.description}
        </p>
      )}

      {template.tags && template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded bg-white/5 text-xs text-gray-400"
            >
              #{tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{template.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{template.placeholders?.length || 0} placeholders</span>
          <span>•</span>
          <span>{template.usageCount || 0} uses</span>
        </div>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => navigate(`/templates/${template._id}/edit`)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="Edit"
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
          <button
            onClick={() => onDuplicate && onDuplicate(template._id)}
            className="p-2 text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors"
            title="Duplicate"
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          {!template.isSystem && (
            <button
              onClick={() => onDelete && onDelete(template._id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete"
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
      </div>
    </div>
  );
};

export default TemplateCard;
