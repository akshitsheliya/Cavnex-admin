import React from "react";

const Avatar = ({
  src,
  alt = "",
  name = "",
  size = "md",
  status,
  className = "",
}) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-3xl",
  };

  const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
    "2xl": "w-4 h-4",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Generate consistent color from name
  const getColorFromName = (name) => {
    if (!name) return "from-gray-600 to-gray-700";
    const colors = [
      "from-neon-green to-emerald-600",
      "from-neon-blue to-blue-600",
      "from-purple-500 to-purple-700",
      "from-pink-500 to-pink-700",
      "from-orange-500 to-orange-700",
      "from-cyan-500 to-cyan-700",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-white/10`}
        />
      ) : (
        <div
          className={`
                        ${sizes[size]} rounded-full flex items-center justify-center
                        bg-gradient-to-br ${getColorFromName(name)}
                        ring-2 ring-white/10 font-medium text-white
                    `}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`
                        absolute bottom-0 right-0 ${statusSizes[size]} 
                        ${statusColors[status]} rounded-full
                        ring-2 ring-black
                    `}
        />
      )}
    </div>
  );
};

export default Avatar;
