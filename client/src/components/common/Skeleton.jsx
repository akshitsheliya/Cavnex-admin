import React from "react";

const Skeleton = ({
  variant = "text",
  width,
  height,
  count = 1,
  className = "",
}) => {
  const variants = {
    text: "h-4 rounded",
    title: "h-6 rounded",
    avatar: "rounded-full",
    thumbnail: "rounded-xl",
    button: "h-10 rounded-xl",
    card: "h-32 rounded-xl",
  };

  const baseClasses = `
        bg-white/5 animate-pulse
        ${variants[variant]}
        ${className}
    `;

  const style = {
    width: width || (variant === "avatar" ? "40px" : "100%"),
    height: height || undefined,
  };

  if (variant === "avatar") {
    style.height = style.width;
  }

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div key={i} className={baseClasses} style={style} />
      ))}
    </>
  );
};

// Skeleton Card
export const SkeletonCard = ({ className = "" }) => (
  <div className={`glass-card p-6 ${className}`}>
    <div className="flex items-start gap-4">
      <Skeleton variant="avatar" width="48px" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" width="60%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" width="90%" />
    </div>
  </div>
);

// Skeleton Table
export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} variant="text" width={j === 0 ? "30%" : "20%"} />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
