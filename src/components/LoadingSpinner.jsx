import React from "react";

export default function LoadingSpinner({ label = "Processing..." }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
      </div>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
