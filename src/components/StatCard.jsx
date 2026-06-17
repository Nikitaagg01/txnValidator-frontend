import React from "react";

export default function StatCard({ label, value, sub, color = "default", icon }) {
  const colorMap = {
    default: "text-white",
    blue: "text-brand-400",
    green: "text-emerald-400",
    red: "text-red-400",
    yellow: "text-amber-400",
    purple: "text-purple-400",
  };

  const bgMap = {
    default: "bg-slate-800",
    blue: "bg-brand-600/10 border-brand-600/20",
    green: "bg-emerald-500/10 border-emerald-500/20",
    red: "bg-red-500/10 border-red-500/20",
    yellow: "bg-amber-500/10 border-amber-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className={`stat-card border ${bgMap[color]}`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      <p className={`text-3xl font-semibold mt-2 font-mono tracking-tight ${colorMap[color]}`}>
        {value ?? "—"}
      </p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}
