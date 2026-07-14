import { ArrowRightLeft, CheckCircle2, TriangleAlert } from "lucide-react";

function ConflictField({ label, value, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 ${tones[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 font-medium">{value}</p>
    </div>
  );
}

export default function ConflictTimeline({ conflicts = [] }) {
  if (!conflicts.length) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-amber-200 bg-[linear-gradient(135deg,rgba(254,243,199,0.9),rgba(255,255,255,0.95))] px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
              Conflict resolution
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Contextual fusion audit trail
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Each conflict shows the PDF value, the email value, the final
              resolved value, and the reason the system chose it.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 shadow-sm">
            <TriangleAlert className="h-3.5 w-3.5" />
            {conflicts.length} conflict{conflicts.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <div className="space-y-4">
          {conflicts.map((conflict, index) => (
            <div key={`${conflict.field}-${index}`} className="relative pl-8">
              <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-[11px] font-semibold text-amber-700">
                {index + 1}
              </div>
              {index < conflicts.length - 1 ? (
                <div className="absolute left-[11px] top-6 h-full w-px bg-amber-200" />
              ) : null}

              <article className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                      Field
                    </p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                      {conflict.field}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Email intent applied
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
                  <ConflictField
                    label="PDF value"
                    value={conflict.pdf_value}
                    tone="amber"
                  />
                  <div className="flex items-center justify-center rounded-xl bg-amber-50 px-3 py-3 text-amber-600">
                    <ArrowRightLeft className="h-5 w-5 rotate-90 lg:rotate-0" />
                  </div>
                  <ConflictField
                    label="Email value"
                    value={conflict.email_value}
                    tone="blue"
                  />
                  <div className="flex items-center justify-center rounded-xl bg-emerald-50 px-3 py-3 text-emerald-600">
                    <ArrowRightLeft className="h-5 w-5 rotate-90 lg:rotate-0" />
                  </div>
                  <ConflictField
                    label="Resolved value"
                    value={conflict.resolved_value}
                    tone="green"
                  />
                </div>

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Reason
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {conflict.reason}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
