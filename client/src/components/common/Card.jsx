import React from "react";

const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = "",
  padding = true,
  hover = false,
  gradient = false,
}) => {
  return (
    <div
      className={`
                relative rounded-2xl overflow-hidden transition-all duration-300
                ${gradient ? "gradient-border" : "glass-card"}
                ${hover ? "hover:border-neon-green/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] hover:-translate-y-1" : ""}
                ${className}
            `}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-neon-blue/5 pointer-events-none" />
      )}

      {(title || actions) && (
        <div className="relative flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={`relative ${padding ? "p-4 sm:p-6" : ""}`}>{children}</div>
    </div>
  );
};

export default Card;
