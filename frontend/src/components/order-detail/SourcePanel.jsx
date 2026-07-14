import { Mail, Paperclip, FileText, ShieldCheck } from "lucide-react";

function DetailBadge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function EvidenceCard({ title, icon, tone, children, footer }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Source evidence
            </p>
          </div>
        </div>
        <DetailBadge tone="slate">Auditable</DetailBadge>
      </div>
      <div className="mt-4 space-y-4">
        {children}
        {footer ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {footer}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function SourcePanel({
  email_subject,
  email_body,
  attachment_name,
  attachment_type,
  extracted_attachment_text,
  processing_confidence,
}) {
  const confidence =
    typeof processing_confidence === "number"
      ? Math.round(processing_confidence * 100)
      : null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Source evidence
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            Email thread and attachment reconciliation
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DetailBadge tone="blue">Email + PDF</DetailBadge>
          <DetailBadge
            tone={confidence !== null && confidence >= 90 ? "green" : "amber"}
          >
            {confidence !== null
              ? `${confidence}% confidence`
              : "Confidence n/a"}
          </DetailBadge>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <EvidenceCard
          title="Email evidence"
          icon={<Mail className="h-4 w-4 text-blue-700" />}
          tone="bg-blue-50"
          footer="Customer intent extracted from the email thread"
        >
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Subject
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {email_subject || "Not available"}
              </p>
            </div>
            <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
              {email_body || "No email body provided."}
            </pre>
          </div>
        </EvidenceCard>

        <EvidenceCard
          title="Attachment evidence"
          icon={<Paperclip className="h-4 w-4 text-emerald-700" />}
          tone="bg-emerald-50"
          footer="Attachment text is extracted before reconciliation"
        >
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  File name
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {attachment_name || "Not available"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Type
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {attachment_type || "Not available"}
                </p>
              </div>
            </div>
            <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
              {extracted_attachment_text ||
                "No extracted attachment text provided."}
            </pre>
          </div>
        </EvidenceCard>

        <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Structured output
              </p>
              <p className="text-sm text-slate-600">
                Extracted into validated fields.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Auditable path
              </p>
              <p className="text-sm text-slate-600">
                Every override is traceable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
