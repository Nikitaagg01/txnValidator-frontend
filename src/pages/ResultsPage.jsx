import React from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import ErrorTable from "../components/ErrorTable";
import ChunkDownloader from "../components/ChunkDownloader";
import ExportPanel from "../components/ExportPanel";
import { downloadCleanUrl, downloadErrorsUrl, downloadAnnotatedUrl } from "../utils/api";

export default function ResultsPage({ validationData, uploadData }) {
  const navigate = useNavigate();
  const { summary, errors, total_errors } = validationData || {};

  if (!summary) return null;

  const errorPercent = parseFloat(summary.error_percentage);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Validation Results</h2>
          <p className="text-sm text-slate-500 mt-1">
            {uploadData?.filename} · {summary.total_rows.toLocaleString()} rows processed
          </p>
        </div>
        <button onClick={() => navigate("/")} className="btn-secondary text-sm">
          ← New Upload
        </button>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Records"   value={summary.total_rows.toLocaleString()}   icon="📁" color="blue" />
        <StatCard label="Valid Records"   value={summary.valid_rows.toLocaleString()}   icon="✅" color="green"
                  sub={`${(100 - errorPercent).toFixed(1)}% pass rate`} />
        <StatCard label="Invalid Records" value={summary.invalid_rows.toLocaleString()} icon="❌" color="red"
                  sub={`${summary.error_percentage}% of total`} />
        <StatCard label="Error Rate" value={`${summary.error_percentage}%`} icon="📉"
                  color={errorPercent < 5 ? "green" : errorPercent < 20 ? "yellow" : "red"}
                  sub={errorPercent < 5 ? "Low" : errorPercent < 20 ? "Moderate" : "High"} />
      </div>

      {/* Error breakdown cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Phone Errors"       value={summary.phone_errors}     color="yellow" icon="📱" />
        <StatCard label="Date Errors"        value={summary.date_errors}      color="yellow" icon="📅" />
        <StatCard label="Duplicate Order IDs" value={summary.duplicate_errors} color="purple" icon="🔁" />
        <StatCard label="Payment Mode Errors" value={summary.payment_errors}   color="yellow" icon="💳" />
        <StatCard label="Amount Errors"      value={summary.amount_errors}    color="yellow" icon="💰" />
        <StatCard label="Integrity Errors"   value={summary.integrity_errors} color="red"    icon="🔍" />
      </div>

      {/* Distribution bar */}
      <div className="card p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Error Distribution
        </p>
        <div className="space-y-3">
          {[
            { label: "Phone",        value: summary.phone_errors,     color: "bg-amber-500" },
            { label: "Date",         value: summary.date_errors,      color: "bg-blue-500" },
            { label: "Duplicate",    value: summary.duplicate_errors, color: "bg-purple-500" },
            { label: "Payment Mode", value: summary.payment_errors,   color: "bg-orange-500" },
            { label: "Amount",       value: summary.amount_errors,    color: "bg-rose-500" },
          ].map((item) => {
            const pct = summary.total_rows > 0
              ? ((item.value / summary.total_rows) * 100).toFixed(1)
              : 0;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-28 shrink-0">{item.label}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`}
                       style={{ width: `${Math.min(parseFloat(pct), 100)}%` }} />
                </div>
                <span className="text-xs font-mono text-slate-400 w-16 text-right shrink-0">
                  {item.value} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Downloads ── */}
      <ExportPanel summary={summary} />

      {/* Error table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Validation Errors</p>
          <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">{total_errors} total</span>
        </div>
        <ErrorTable errors={errors || []} />
      </div>

      {/* Chunker */}
      <div className="card p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Split Into Chunks</p>
        <p className="text-xs text-slate-600 mb-4">
          Automatically split the cleaned data into smaller, manageable files.
        </p>
        <ChunkDownloader hasValidData={summary.valid_rows > 0} />
      </div>
    </div>
  );
}
