/**
 * ExportPanel
 *
 * Three download modes, clearly explained:
 *
 *  1. Valid rows only      → cleaned_data.csv         (skip all invalid rows)
 *  2. Invalid rows only    → errors.csv               (error report with reasons)
 *  3. All rows + errors    → all_rows_annotated.csv   (keep everything, add validation_errors column)
 */

import React, { useState } from "react";
import { downloadCleanUrl, downloadErrorsUrl, downloadAnnotatedUrl } from "../utils/api";

// ── mode definitions ──────────────────────────────────────────────────────────

const MODES = [
  {
    id: "clean",
    icon: "✅",
    title: "Valid Rows Only",
    subtitle: "cleaned_data.csv",
    description:
      "Skip all invalid rows. Output contains only rows that passed every validation check — ready to load into your database or system.",
    tag: "Skip invalid",
    tagColor: "emerald",
    colPreview: ["order_id", "customer_name", "phone", "country", "date", "payment_mode", "amount"],
    exampleNote: "No extra columns. Every row is clean.",
    getUrl: downloadCleanUrl,
    filename: "cleaned_data.csv",
  },
  {
    id: "errors",
    icon: "❌",
    title: "Invalid Rows Only",
    subtitle: "errors.csv",
    description:
      "Download only the rows that failed validation, with a breakdown of what went wrong. Use this to fix issues at the source.",
    tag: "Errors only",
    tagColor: "red",
    colPreview: ["row_number", "order_id", "error_type", "current_value", "suggested_fix", "error_reason"],
    exampleNote: "Includes suggested fixes for each error.",
    getUrl: downloadErrorsUrl,
    filename: "errors.csv",
  },
  {
    id: "annotated",
    icon: "📋",
    title: "All Rows + Error Notes",
    subtitle: "all_rows_annotated.csv",
    description:
      "Keep every row — valid and invalid — in one file. Invalid rows get an extra validation_errors column describing what's wrong. Valid rows have an empty validation_errors cell.",
    tag: "Keep all",
    tagColor: "brand",
    colPreview: ["order_id", "customer_name", "phone", "country", "date", "payment_mode", "amount", "validation_errors"],
    exampleNote: 'Valid rows → validation_errors = ""\nInvalid rows → validation_errors = "Invalid Phone; Duplicate Order ID"',
    getUrl: downloadAnnotatedUrl,
    filename: "all_rows_annotated.csv",
    highlight: true,
  },
];

// ── colour helpers ────────────────────────────────────────────────────────────

const tagStyles = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  red:     "bg-red-500/10     text-red-400     border-red-500/20",
  brand:   "bg-brand-500/10   text-brand-400   border-brand-500/20",
};

const borderActive = {
  emerald: "border-emerald-500/40 bg-emerald-500/5",
  red:     "border-red-500/40     bg-red-500/5",
  brand:   "border-brand-500/40   bg-brand-500/5",
};

const borderIdle = "border-slate-700/60 bg-slate-800/20 hover:border-slate-600";

const downloadBtn = {
  emerald: "bg-emerald-600 hover:bg-emerald-500 text-white",
  red:     "bg-red-600     hover:bg-red-500     text-white",
  brand:   "bg-brand-600   hover:bg-brand-500   text-white",
};

// ── component ─────────────────────────────────────────────────────────────────

export default function ExportPanel({ summary }) {
  const [selected, setSelected] = useState("annotated"); // default to the new mode

  const active = MODES.find((m) => m.id === selected);

  return (
    <div className="card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Export Results
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            Choose how to export your data
          </p>
        </div>
        <div className="flex gap-1.5 text-xs text-slate-500">
          <span className="font-mono bg-slate-800 px-2 py-1 rounded">
            {summary.valid_rows.toLocaleString()} valid
          </span>
          <span className="font-mono bg-slate-800 px-2 py-1 rounded">
            {summary.invalid_rows.toLocaleString()} invalid
          </span>
          <span className="font-mono bg-slate-800 px-2 py-1 rounded">
            {summary.total_rows.toLocaleString()} total
          </span>
        </div>
      </div>

      {/* Mode selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MODES.map((mode) => {
          const isActive = selected === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setSelected(mode.id)}
              className={`
                relative text-left rounded-xl border p-4 transition-all duration-200
                ${isActive ? borderActive[mode.tagColor] : borderIdle}
                focus:outline-none focus:ring-2 focus:ring-brand-500/50
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-current opacity-70"
                      style={{ color: mode.tagColor === "emerald" ? "#34d399" : mode.tagColor === "red" ? "#f87171" : "#818cf8" }} />
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{mode.icon}</span>
                <span className={`badge border text-[10px] font-semibold ${tagStyles[mode.tagColor]}`}>
                  {mode.tag}
                </span>
              </div>
              <p className="text-sm font-semibold text-white leading-tight">{mode.title}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{mode.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Detail panel for selected mode */}
      {active && (
        <div className={`rounded-xl border p-5 space-y-4 transition-all duration-300 ${borderActive[active.tagColor]}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{active.icon}</span>
                <p className="text-base font-semibold text-white">{active.title}</p>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{active.description}</p>
            </div>
          </div>

          {/* Column preview */}
          <div>
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Columns in output file
            </p>
            <div className="flex flex-wrap gap-1.5">
              {active.colPreview.map((col) => (
                <span
                  key={col}
                  className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                    col === "validation_errors"
                      ? "bg-brand-500/15 text-brand-400 border-brand-500/30 font-semibold"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {col}
                  {col === "validation_errors" && (
                    <span className="ml-1 text-brand-500">← new</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Example note */}
          <div className="bg-slate-900/60 rounded-lg px-4 py-3 border border-slate-800">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Example
            </p>
            <pre className="text-[11px] text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">
              {active.exampleNote}
            </pre>
          </div>

          {/* Row count info */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {active.id === "clean"     && `${summary.valid_rows.toLocaleString()} rows will be exported`}
              {active.id === "errors"    && `${summary.invalid_rows.toLocaleString()} rows will be exported`}
              {active.id === "annotated" && `${summary.total_rows.toLocaleString()} rows will be exported (all rows preserved)`}
            </div>

            {/* Download button */}
            <a
              href={active.getUrl()}
              download={active.filename}
              className={`
                inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                transition-all duration-200 no-underline
                ${downloadBtn[active.tagColor]}
              `}
            >
              <span>↓</span>
              Download {active.subtitle}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
