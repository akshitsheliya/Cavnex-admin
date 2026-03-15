import React, { useState } from "react";

const AgreementSection = ({
  section,
  onUpdate,
  sectionKey,
  isEditing = false,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(section.content || "");
  const [editedItems, setEditedItems] = useState(section.items || []);

  const handleSave = () => {
    onUpdate(sectionKey, {
      ...section,
      content: editedContent,
      items: editedItems,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(section.content || "");
    setEditedItems(section.items || []);
    setEditing(false);
  };

  const handleAddItem = () => {
    setEditedItems([...editedItems, ""]);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...editedItems];
    newItems[index] = value;
    setEditedItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setEditedItems(editedItems.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{section.title}</h3>
        {isEditing && section.editable !== false && (
          <button
            onClick={() => (editing ? handleCancel() : setEditing(true))}
            className="text-sm text-gray-400 hover:text-neon-green transition-colors"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none font-mono text-sm"
          />

          {editedItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">List Items:</p>
              {editedItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-green/50"
                  />
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddItem}
                className="text-sm text-neon-green hover:underline"
              >
                + Add Item
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-neon-green text-black rounded-lg font-medium hover:bg-neon-green/90 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {section.content}
          </p>
          {section.items && section.items.length > 0 && (
            <ul className="mt-3 space-y-2">
              {section.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-300"
                >
                  <span className="text-neon-green mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AgreementSection;
