import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const STATUS_BADGE_STYLES = {
  exception: "border-amber-200 bg-amber-50 text-amber-700",
  validated: "border-blue-200 bg-blue-50 text-blue-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  billed: "border-violet-200 bg-violet-50 text-violet-700",
  default: "border-slate-200 bg-slate-100 text-slate-700",
};

export default function RepairHeader({ orderId, customerName, status }) {
  const badgeStyle = STATUS_BADGE_STYLES[status] || STATUS_BADGE_STYLES.default;

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Link
            to={`/order/${orderId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to order detail
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
              Exception Resolution Console
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${badgeStyle}`}
            >
              {status}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Transaction Ref: {orderId}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {customerName}
            </h1>
            <p className="text-sm text-slate-600">
              Resolve document extraction discrepancies and register persistent catalog mappings
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

