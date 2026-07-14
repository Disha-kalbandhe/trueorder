import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { getOrderById } from "../api/client";
import ConflictTimeline from "../components/order-detail/ConflictTimeline";
import ItemsTable from "../components/order-detail/ItemsTable";
import OrderSummaryCard from "../components/order-detail/OrderSummaryCard";
import SourcePanel from "../components/order-detail/SourcePanel";
import StatusStepper from "../components/order-detail/StatusStepper";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const STATUS_BADGE_STYLES = {
  exception: "border-amber-200 bg-amber-50 text-amber-700",
  validated: "border-blue-200 bg-blue-50 text-blue-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  billed: "border-violet-200 bg-violet-50 text-violet-700",
  default: "border-slate-200 bg-slate-100 text-slate-700",
};

function formatDateTime(value) {
  if (!value) return "Not available";

  try {
    return format(new Date(value), "dd MMM yyyy, HH:mm");
  } catch {
    return String(value);
  }
}

function formatCurrency(value) {
  if (typeof value !== "number") return "Not available";
  return CURRENCY_FORMATTER.format(value);
}

function getResolutionSource(order) {
  return order.conflicts?.length
    ? "Email intent applied"
    : "Attachment matched";
}

function getResolutionTone(order) {
  return order.conflicts?.length ? "warning" : "success";
}

function getStatusBadgeClass(status) {
  return STATUS_BADGE_STYLES[status] || STATUS_BADGE_STYLES.default;
}

function LoadingState() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-24 shadow-sm">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCcw className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading order detail…</span>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-xl border border-rose-200 bg-white px-6 py-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              Could not load order
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              The order detail payload is unavailable.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      if (!id) {
        if (!cancelled) {
          setError("Missing order id in the route.");
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getOrderById(id);
        if (!cancelled) {
          setOrder(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setOrder(null);
          setError(
            err?.response?.data?.error ||
              err?.message ||
              "Failed to fetch order detail.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [id, retryTick]);

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setRetryTick((value) => value + 1);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  if (!order) {
    return (
      <ErrorState
        message="No order was returned by the backend."
        onRetry={handleRetry}
      />
    );
  }

  const hasConflicts =
    Array.isArray(order.conflicts) && order.conflicts.length > 0;
  const totalItems = Array.isArray(order.items) ? order.items.length : 0;
  const resolutionSource = getResolutionSource(order);
  const resolutionTone = getResolutionTone(order);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to dashboard
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
                    Order detail
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${getStatusBadgeClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Order ID
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                      {order.id}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
                    <span className="font-medium text-slate-900">
                      {order.customer_name}
                    </span>
                    <span className="sm:inline-block">
                      {order.customer_email}
                    </span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                    <span>Created {formatDateTime(order.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col xl:items-end">
                {order.status === "exception" ? (
                  <Link
                    to={`/repair/${order.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Go to repair flow
                  </Link>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 xl:min-w-[300px]">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Source chain
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      Email thread + attachment
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Source email ref: {order.source_email_id}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Resolution mode
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {resolutionSource}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Auditable and traceable reconciliation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <OrderSummaryCard
                label="Total amount"
                value={formatCurrency(order.total_amount)}
                tone="success"
              />
              <OrderSummaryCard
                label="Total items"
                value={`${totalItems}`}
                tone="info"
              />
              <OrderSummaryCard
                label="Conflicts"
                value={`${order.conflicts?.length || 0}`}
                tone={hasConflicts ? "warning" : "neutral"}
              />
              <OrderSummaryCard
                label="Resolution source"
                value={resolutionSource}
                tone={resolutionTone}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <SourcePanel
            email_subject={order.email_subject}
            email_body={order.email_body}
            attachment_name={order.attachment_name}
            attachment_type={order.attachment_type}
            extracted_attachment_text={order.extracted_attachment_text}
            processing_confidence={order.processing_confidence}
          />

          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <OrderSummaryCard
                label="Customer"
                value={order.customer_name}
                tone="neutral"
              />
              <OrderSummaryCard
                label="Customer email"
                value={order.customer_email}
                tone="neutral"
              />
              <OrderSummaryCard
                label="Created at"
                value={formatDateTime(order.created_at)}
                tone="info"
              />
              <OrderSummaryCard
                label="Decision summary"
                value={order.decision_summary || "Not available"}
                tone={hasConflicts ? "warning" : "success"}
              />
            </div>
            <ItemsTable items={order.items || []} />
            <StatusStepper status={order.status} />
          </div>
        </section>

        {hasConflicts ? <ConflictTimeline conflicts={order.conflicts} /> : null}
      </div>
    </div>
  );
}
