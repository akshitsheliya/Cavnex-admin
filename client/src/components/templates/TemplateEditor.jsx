import React, { useRef, useEffect } from "react";
import PlaceholderHelper from "./PlaceholderHelper";
import {
  extractPlaceholders,
  generatePreviewWithHighlights,
} from "../../utils/templateEngine";

const TemplateEditor = ({
  value,
  onChange,
  placeholder = "Enter template content...",
  rows = 15,
  showPlaceholderHelper = true,
  showPreview = true,
}) => {
  const textareaRef = useRef(null);

  const handleInsertPlaceholder = (placeholder) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newValue = before + placeholder + after;
    onChange(newValue);

    // Set cursor position after inserted placeholder
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        start + placeholder.length;
    }, 0);
  };

  const extractedPlaceholders = extractPlaceholders(value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Editor */}
      <div
        className={`${showPlaceholderHelper ? "lg:col-span-2" : "lg:col-span-3"}`}
      >
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-sm text-gray-500 px-2">Formatting:</span>
            <button
              type="button"
              onClick={() => handleInsertPlaceholder("**bold**")}
              className="px-3 py-1 rounded text-sm text-gray-400 hover:text-white hover:bg-white/5 font-bold"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => handleInsertPlaceholder("*italic*")}
              className="px-3 py-1 rounded text-sm text-gray-400 hover:text-white hover:bg-white/5 italic"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => handleInsertPlaceholder("\n# Heading\n")}
              className="px-3 py-1 rounded text-sm text-gray-400 hover:text-white hover:bg-white/5"
              title="Heading"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => handleInsertPlaceholder("\n## Subheading\n")}
              className="px-3 py-1 rounded text-sm text-gray-400 hover:text-white hover:bg-white/5"
              title="Subheading"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => handleInsertPlaceholder("\n- List item\n")}
              className="px-3 py-1 rounded text-sm text-gray-400 hover:text-white hover:bg-white/5"
              title="List"
            >
              • List
            </button>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <span className="text-xs text-gray-500">
              {extractedPlaceholders.length} placeholders detected
            </span>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none font-mono text-sm leading-relaxed"
          />

          {/* Detected Placeholders */}
          {extractedPlaceholders.length > 0 && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-sm text-gray-400 mb-2">
                Detected Placeholders:
              </p>
              <div className="flex flex-wrap gap-2">
                {extractedPlaceholders.map((key) => (
                  <span
                    key={key}
                    className="px-2 py-1 rounded bg-neon-green/20 text-neon-green text-xs"
                  >
                    {`{{${key}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {showPreview && value && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-sm text-gray-400 mb-3">
                Preview (with highlighted placeholders):
              </p>
              <div
                className="prose prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{
                  __html: generatePreviewWithHighlights(value).replace(
                    /\n/g,
                    "<br>"
                  ),
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Placeholder Helper */}
      {showPlaceholderHelper && (
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <PlaceholderHelper onInsert={handleInsertPlaceholder} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateEditor;
