import React, { useState } from "react";
import { placeholderCategories } from "../../data/placeholders";

const PlaceholderHelper = ({ onInsert, compact = false }) => {
  const [activeCategory, setActiveCategory] = useState("client");
  const [searchTerm, setSearchTerm] = useState("");

  const handleInsert = (key) => {
    if (onInsert) {
      onInsert(`{{${key}}}`);
    }
  };

  const filteredPlaceholders = searchTerm
    ? Object.values(placeholderCategories).flatMap((cat) =>
        cat.placeholders.filter(
          (p) =>
            p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : placeholderCategories[activeCategory]?.placeholders || [];

  if (compact) {
    return (
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-4 h-4 text-neon-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <span className="text-sm text-gray-400">Insert Placeholder</span>
        </div>
        <input
          type="text"
          placeholder="Search placeholders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 mb-2"
        />
        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
          {filteredPlaceholders.slice(0, 20).map((placeholder) => (
            <button
              key={placeholder.key}
              onClick={() => handleInsert(placeholder.key)}
              className="px-2 py-1 text-xs rounded bg-white/5 text-gray-300 hover:bg-neon-green/20 hover:text-neon-green transition-colors"
              title={placeholder.example}
            >
              {`{{${placeholder.key}}}`}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        Placeholders
      </h3>

      {/* Search */}
      <input
        type="text"
        placeholder="Search placeholders..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 mb-4"
      />

      {/* Category Tabs */}
      {!searchTerm && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(placeholderCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                activeCategory === key
                  ? "bg-neon-green text-black font-medium"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Placeholders List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredPlaceholders.map((placeholder) => (
          <div
            key={placeholder.key}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-neon-green/30 transition-all group"
          >
            <div>
              <p className="text-white font-medium">{placeholder.label}</p>
              <p className="text-xs text-gray-500">
                <code className="bg-white/5 px-1 rounded">{`{{${placeholder.key}}}`}</code>
                {placeholder.example && (
                  <span className="ml-2">→ {placeholder.example}</span>
                )}
              </p>
            </div>
            <button
              onClick={() => handleInsert(placeholder.key)}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-neon-green/20 hover:text-neon-green transition-colors opacity-0 group-hover:opacity-100"
            >
              Insert
            </button>
          </div>
        ))}

        {filteredPlaceholders.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No placeholders found
          </p>
        )}
      </div>

      {/* Usage hint */}
      <div className="mt-4 p-3 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
        <p className="text-sm text-gray-400">
          <span className="text-neon-blue font-medium">Tip:</span> Click on any
          placeholder to insert it at the cursor position, or copy the code
          manually.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderHelper;
