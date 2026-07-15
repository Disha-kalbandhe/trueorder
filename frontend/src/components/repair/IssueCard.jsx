import React from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export default function IssueCard({ issue, isActive, isResolved, onClick }) {
  const { label, field, extractedValue, reason, severity } = issue;

  const severityBadges = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const severityText = {
    high: "Critical Mismatch",
    medium: "Validation Exception",
    low: "Information Notice",
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 ${
        isActive
          ? "border-blue-600 bg-white shadow-md ring-1 ring-blue-600/30"
          : isResolved
            ? "border-emerald-200 bg-emerald-50/10 hover:border-emerald-300 hover:bg-emerald-50/20"
            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
              severityBadges[severity] || "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            {severityText[severity] || severity}
          </span>
          <h3 className="font-bold text-slate-900 text-sm leading-snug">{label}</h3>
        </div>

        {isResolved ? (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 border border-emerald-200 rounded-full px-2.5 py-0.5">
            <CheckCircle2 className="h-3 w-3" />
            Resolved
          </span>
        ) : isActive ? (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 border border-blue-200 rounded-full px-2.5 py-0.5">
            <Info className="h-3 w-3" />
            Selected
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Target Field</div>
          <div className="col-span-2 font-mono font-bold text-slate-900 break-all">
            {field}
          </div>

          <div className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Extracted Value</div>
          <div className="col-span-2 font-mono font-bold text-slate-900 break-all bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/50 inline-block w-fit">
            {String(extractedValue)}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 border border-slate-200/60 flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{reason}</span>
        </div>
      </div>
    </div>
  );
}

