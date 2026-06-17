import React, { useState } from "react";

export default function ErrorTable({ errors = [] }) {
  const [page, setPage] = useState(1);
  const perPage = 20;
  const totalPages = Math.ceil(errors.length / perPage);
  const slice = errors.slice((page - 1) * perPage, page * perPage);

  if (errors.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        No errors found — all rows passed validation.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 pr-4">
                Row #
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 pr-4">
                Order ID
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">
                Error Reason
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {slice.map((err, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 pr-4 font-mono text-xs text-slate-400">
                  {err.row_number}
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-slate-300">
                  {err.order_id || <span className="text-slate-600">—</span>}
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {err.error_reason.split(";").map((reason, ri) => (
                      <span
                        key={ri}
                        className="badge bg-red-500/10 text-red-400 border border-red-500/20"
                      >
                        {reason.trim()}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, errors.length)} of{" "}
            {errors.length} errors
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="flex items-center text-xs text-slate-400 px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
