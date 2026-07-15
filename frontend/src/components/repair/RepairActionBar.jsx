import React from "react";
import { CheckSquare, ShieldCheck, AlertTriangle } from "lucide-react";

export default function RepairActionBar({
  totalIssues,
  resolvedCount,
  hasCriticalUnresolved,
  isSubmitting,
  onValidate,
  onReset,
  onCancel,
}) {
  const percentComplete = totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 0;
  const isReady = resolvedCount === totalIssues;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-900 p-6 text-white shadow-lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Reconciliation Progress
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800 sm:w-48">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <span className="text-sm font-bold">
              {resolvedCount} of {totalIssues} Exceptions Resolved
            </span>
          </div>

          {hasCriticalUnresolved ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Critical catalog matches must be resolved before committing validation status.</span>
            </div>
          ) : isReady ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>All exceptions resolved. Record is ready for validation.</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Ensure high-severity validation discrepancies are resolved before finalizing order status.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-700 bg-transparent px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Reset Overrides
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-700 bg-transparent px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Exit Console
          </button>

          <button
            type="button"
            onClick={onValidate}
            disabled={hasCriticalUnresolved || isSubmitting}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-md transition ${
              hasCriticalUnresolved
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
            }`}
          >
            {isSubmitting ? "Committing..." : "Confirm & Validate"}
          </button>
        </div>
      </div>
    </div>
  );
}

