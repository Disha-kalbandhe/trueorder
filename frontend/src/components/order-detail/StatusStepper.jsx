import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleDot,
} from "lucide-react";

const STEP_ORDER = [
  "received",
  "exception",
  "validated",
  "confirmed",
  "billed",
];

const STEP_META = {
  received: {
    label: "Received",
    description: "Email and attachment arrived in the intake queue.",
  },
  exception: {
    label: "Exception",
    description: "A contradiction or catalog issue requires repair handling.",
  },
  validated: {
    label: "Validated",
    description: "Structured fields were extracted and checked.",
  },
  confirmed: {
    label: "Confirmed",
    description: "A human or downstream system accepted the order.",
  },
  billed: {
    label: "Billed",
    description: "The order was converted into a billing-ready state.",
  },
};

function getStepState(step, status) {
  const statusIndex = STEP_ORDER.indexOf(status);
  const stepIndex = STEP_ORDER.indexOf(step);

  if (statusIndex === -1) {
    return stepIndex === 0 ? "active" : "pending";
  }

  if (stepIndex < statusIndex) return "complete";
  if (stepIndex === statusIndex) return "active";
  return "pending";
}

export default function StatusStepper({ status = "received" }) {
  const isException = status === "exception";

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Status stepper
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              Workflow progression
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            <CircleDashed className="h-3.5 w-3.5" />
            Live state
          </div>
        </div>
      </div>

      <div className="p-6">
        {isException ? (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-amber-700 shadow-sm">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Exception state
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  The order is paused for repair because the email intent
                  overrode at least one attachment field.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 lg:grid-cols-5">
          {STEP_ORDER.map((step) => {
            const state = getStepState(step, status);
            const meta = STEP_META[step];
            const isComplete = state === "complete";
            const isActive = state === "active";

            return (
              <div
                key={step}
                className={`rounded-xl border p-4 shadow-sm ${isComplete ? "border-emerald-200 bg-emerald-50/60" : isActive ? "border-blue-200 bg-blue-50/60" : "border-slate-200 bg-slate-50/60"}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-white ${isComplete ? "border-emerald-200 text-emerald-700" : isActive ? "border-blue-200 text-blue-700" : "border-slate-200 text-slate-400"}`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isActive ? (
                      <CircleDot className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {meta.label}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {meta.description}
                    </p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      {isComplete
                        ? "Complete"
                        : isActive
                          ? "Current"
                          : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
