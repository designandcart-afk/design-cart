"use client";

import { useEffect, useState } from "react";

type NotificationDotProps = {
  show: boolean;
  color?: "coral" | "dark";
  size?: "sm" | "md";
  className?: string;
};

export function NotificationDot({ 
  show, 
  color = "coral", 
  size = "sm",
  className = "" 
}: NotificationDotProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  const sizeClasses = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  const colorClasses = color === "coral" ? "bg-[#d96857]" : "bg-[#2e2e2e]";

  return (
    <span
      className={`
        ${sizeClasses}
        ${colorClasses}
        rounded-full
        inline-block
        ${animate ? "animate-pulse" : ""}
        ${className}
      `}
      aria-label="New notification"
    />
  );
}
