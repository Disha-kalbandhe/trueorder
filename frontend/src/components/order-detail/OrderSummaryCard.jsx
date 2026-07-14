import { AlertTriangle, CheckCircle2, CircleAlert, Info } from "lucide-react";

const TONES = {
  neutral: "border-slate-200 bg-white text-slate-900",
  success: "border-emerald-200 bg-emerald-50/60 text-emerald-900",
  warning: "border-amber-200 bg-amber-50/70 text-amber-900",
  info: "border-blue-200 bg-blue-50/60 text-blue-900",
};

function ToneIcon({ tone }) {
  switch (tone) {
    case "success":
      return <CheckCircle2 className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "info":
      return <Info className="h-4 w-4" />;
    default:
      return <CircleAlert className="h-4 w-4" />;
  }
}

export default function OrderSummaryCard({ label, value, tone = "neutral" }) {
  return (
    <article
      className={`rounded-xl border p-4 shadow-sm ${TONES[tone] || TONES.neutral}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-slate-700 shadow-sm">
          <ToneIcon tone={tone} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}
