import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import {
  renderTemplate,
  prepareTemplateData,
  parseMarkdown,
  extractPlaceholders,
} from "../../utils/templateEngine";

const TemplatePreview = ({ template, initialData = {} }) => {
  const [data, setData] = useState(initialData);
  const [showRaw, setShowRaw] = useState(false);

  const placeholders = extractPlaceholders(template.content);
  const preparedData = prepareTemplateData(data);
  const rendered = renderTemplate(template.content, preparedData);

  const handleDataChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFillSample = () => {
    const sampleData = {};
    if (template.placeholders) {
      template.placeholders.forEach((p) => {
        if (p.defaultValue) {
          sampleData[p.key] = p.defaultValue;
        } else {
          // Generate sample based on type
          switch (p.type) {
            case "currency":
              sampleData[p.key] = 100000;
              break;
            case "date":
              sampleData[p.key] = new Date().toISOString().split("T")[0];
              break;
            case "number":
              sampleData[p.key] = 10;
              break;
            default:
              sampleData[p.key] = `Sample ${p.label}`;
          }
        }
      });
    }
    setData(sampleData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Data Input */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Test Data</h3>
          <Button variant="ghost" size="sm" onClick={handleFillSample}>
            Fill Sample
          </Button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {placeholders.map((key) => {
            const placeholder = template.placeholders?.find(
              (p) => p.key === key
            );
            const label =
              placeholder?.label || key.replace(/([A-Z])/g, " $1").trim();
            const type = placeholder?.type || "text";

            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {label}
                  {placeholder?.required && (
                    <span className="text-neon-green ml-1">*</span>
                  )}
                </label>
                {type === "text" || type === "currency" || type === "number" ? (
                  <input
                    type={
                      type === "number" || type === "currency"
                        ? "number"
                        : "text"
                    }
                    value={data[key] || ""}
                    onChange={(e) =>
                      handleDataChange(
                        key,
                        type === "number" || type === "currency"
                          ? Number(e.target.value)
                          : e.target.value
                      )
                    }
                    placeholder={placeholder?.example || `Enter ${label}`}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
                  />
                ) : type === "date" ? (
                  <input
                    type="date"
                    value={data[key] || ""}
                    onChange={(e) => handleDataChange(key, e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                  />
                ) : (
                  <input
                    type="text"
                    value={data[key] || ""}
                    onChange={(e) => handleDataChange(key, e.target.value)}
                    placeholder={`Enter ${label}`}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
                  />
                )}
              </div>
            );
          })}

          {placeholders.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No placeholders in this template
            </p>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Preview</h3>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showRaw ? "Show Formatted" : "Show Raw"}
          </button>
        </div>

        <div className="min-h-[300px] p-4 rounded-xl bg-white text-black overflow-auto">
          {showRaw ? (
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {rendered}
            </pre>
          ) : (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(rendered) }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
