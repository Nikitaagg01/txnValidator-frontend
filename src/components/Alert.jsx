import React from "react";

const variants = {
  success: {
    wrapper: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    icon: "✓",
    iconClass: "text-emerald-400",
  },
  error: {
    wrapper: "bg-red-500/10 border-red-500/30 text-red-300",
    icon: "✕",
    iconClass: "text-red-400",
  },
  info: {
    wrapper: "bg-brand-500/10 border-brand-500/30 text-brand-300",
    icon: "ℹ",
    iconClass: "text-brand-400",
  },
  warning: {
    wrapper: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    icon: "⚠",
    iconClass: "text-amber-400",
  },
};

export default function Alert({ type = "info", message, onClose }) {
  const v = variants[type] || variants.info;

  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm font-medium animate-fade-in ${v.wrapper}`}
    >
      <span className={`mt-0.5 text-base leading-none ${v.iconClass}`}>{v.icon}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
