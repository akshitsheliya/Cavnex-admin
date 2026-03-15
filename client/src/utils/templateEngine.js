/**
 * Template Engine Utility
 * Handles placeholder replacement and template rendering
 */

// Replace placeholders in content
export const renderTemplate = (content, data = {}) => {
  if (!content) return "";

  let rendered = content;

  // Replace all {{placeholder}} patterns
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    const value = data[key];

    // Handle different value types
    if (Array.isArray(value)) {
      rendered = rendered.replace(regex, value.join(", "));
    } else if (typeof value === "object" && value !== null) {
      rendered = rendered.replace(regex, JSON.stringify(value));
    } else {
      rendered = rendered.replace(regex, String(value || ""));
    }
  });

  // Remove any remaining unreplaced placeholders
  rendered = rendered.replace(/\{\{\w+\}\}/g, "");

  return rendered;
};

// Extract placeholders from content
export const extractPlaceholders = (content) => {
  if (!content) return [];

  const regex = /\{\{(\w+)\}\}/g;
  const placeholders = new Set();
  let match;

  while ((match = regex.exec(content)) !== null) {
    placeholders.add(match[1]);
  }

  return Array.from(placeholders);
};

// Validate that all required placeholders have values
export const validatePlaceholders = (content, data, requiredKeys = []) => {
  const extracted = extractPlaceholders(content);
  const missing = [];

  requiredKeys.forEach((key) => {
    if (extracted.includes(key) && (!data[key] || data[key] === "")) {
      missing.push(key);
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
  };
};

// Format currency
export const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Format date
export const formatDate = (date, format = "long") => {
  if (!date) return "";

  const d = new Date(date);

  switch (format) {
    case "short":
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    case "long":
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    case "iso":
      return d.toISOString().split("T")[0];
    default:
      return d.toLocaleDateString("en-IN");
  }
};

// Prepare data for template rendering (auto-format values)
export const prepareTemplateData = (rawData, formatOptions = {}) => {
  const prepared = { ...rawData };

  // Auto-format currency fields
  const currencyFields = [
    "price",
    "subtotal",
    "total",
    "discount",
    "discountAmount",
    "taxAmount",
    "advanceAmount",
    "balanceAmount",
    "amountDue",
  ];

  currencyFields.forEach((field) => {
    if (prepared[field] !== undefined && typeof prepared[field] === "number") {
      prepared[field] = formatCurrency(prepared[field]);
    }
  });

  // Auto-format date fields
  const dateFields = [
    "date",
    "startDate",
    "endDate",
    "dueDate",
    "validUntil",
    "completionDate",
    "currentDate",
  ];

  dateFields.forEach((field) => {
    if (prepared[field]) {
      prepared[field] = formatDate(
        prepared[field],
        formatOptions.dateFormat || "long"
      );
    }
  });

  // Add current date if not present
  if (!prepared.currentDate) {
    prepared.currentDate = formatDate(new Date(), "long");
  }

  // Add current month and year
  const now = new Date();
  if (!prepared.currentMonth) {
    prepared.currentMonth = now.toLocaleString("en-IN", { month: "long" });
  }
  if (!prepared.currentYear) {
    prepared.currentYear = now.getFullYear().toString();
  }

  return prepared;
};

// Parse markdown-like syntax to HTML
export const parseMarkdown = (content) => {
  if (!content) return "";

  let html = content;

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Line breaks
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");

  // Wrap in paragraphs
  if (!html.startsWith("<")) {
    html = `<p>${html}</p>`;
  }

  return html;
};

// Generate preview with highlighted placeholders
export const generatePreviewWithHighlights = (content) => {
  if (!content) return "";

  return content.replace(
    /\{\{(\w+)\}\}/g,
    '<span class="bg-neon-green/20 text-neon-green px-1 rounded">{{$1}}</span>'
  );
};

export default {
  renderTemplate,
  extractPlaceholders,
  validatePlaceholders,
  formatCurrency,
  formatDate,
  prepareTemplateData,
  parseMarkdown,
  generatePreviewWithHighlights,
};
