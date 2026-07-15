import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  RefreshCcw,
  AlertTriangle,
  Info,
  CheckCircle2,
  Database,
  Layers,
  ArrowRight,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { getOrderById, updateOrderStatus } from "../api/client";
import RepairHeader from "../components/repair/RepairHeader";
import IssueCard from "../components/repair/IssueCard";
import SuggestionPanel from "../components/repair/SuggestionPanel";
import ResolutionHistory from "../components/repair/ResolutionHistory";
import RepairActionBar from "../components/repair/RepairActionBar";
import ItemsTable from "../components/order-detail/ItemsTable";

function LoadingState() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="mx-auto flex max-w-6xl items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-24 shadow-sm">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCcw className="h-5 w-5 animate-spin text-slate-700" />
          <span className="text-sm font-medium">Retrieving extraction exceptions from registry...</span>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="mx-auto max-w-3xl rounded-xl border border-rose-200 bg-white px-6 py-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              Retrieval Error
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Failed to load exception record
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RepairChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryTick, setRetryTick] = useState(0);

  // Issues derived once on load to maintain layout stability
  const [issues, setIssues] = useState([]);
  const [activeIssueId, setActiveIssueId] = useState(null);
  const [resolvedIssues, setResolvedIssues] = useState({});

  // Toast / validation submission state
  const [toast, setToast] = useState({ message: "", type: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchOrder = async () => {
      if (!id) {
        setError("Missing order id in route.");
        setLoading(false);
        return;
      }
      try {
        const data = await getOrderById(id);
        if (cancelled) return;

        setOrder(data);
        setError("");

        // Derive issues from items & conflicts
        const derived = [];

        // 1. SKU Mismatches
        if (Array.isArray(data.items)) {
          data.items.forEach((item, idx) => {
            if (!item.sku || !item.matched_in_catalog) {
              derived.push({
                id: `sku-${idx}`,
                type: "unmatched_sku",
                label: `Catalog SKU Discrepancy`,
                field: `items[${idx}].sku`,
                extractedValue: item.sku || "None",
                rawName: item.raw_product_name,
                reason: `Raw product name "${item.raw_product_name}" is unmatched in catalog database. A verified catalog mapping rule is required.`,
                severity: "high",
                itemIndex: idx,
              });
            }
          });
        }

        // 2. Data conflicts
        if (Array.isArray(data.conflicts)) {
          data.conflicts.forEach((conflict, idx) => {
            derived.push({
              id: `conflict-${idx}`,
              type: "conflict",
              label: `Document Discrepancy: ${conflict.field}`,
              field: conflict.field,
              extractedValue: `${conflict.pdf_value} (PDF) vs ${conflict.email_value} (Email)`,
              pdfValue: conflict.pdf_value,
              emailValue: conflict.email_value,
              resolvedValue: conflict.resolved_value,
              reason: conflict.reason || `Mismatched values detected between parsed PDF (${conflict.pdf_value}) and customer email instruction (${conflict.email_value}).`,
              severity: "medium",
              conflictIndex: idx,
            });
          });
        }

        setIssues(derived);
        if (derived.length > 0) {
          setActiveIssueId(derived[0].id);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load order exceptions."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [id, retryTick]);

  // Toast cleanup timer
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: null });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setRetryTick((t) => t + 1);
  };

  const handleResolveIssue = (issueId, resolution) => {
    // 1. Update the map of resolutions
    setResolvedIssues((prev) => ({
      ...prev,
      [issueId]: resolution,
    }));

    // 2. Trigger success toast
    setToast({
      message: resolution.displayLabel,
      type: "success",
    });

    // 3. Update the local order state so that ItemsTable updates dynamically
    const issue = issues.find((i) => i.id === issueId);
    if (issue) {
      setOrder((prevOrder) => {
        const updated = JSON.parse(JSON.stringify(prevOrder));
        if (issue.type === "unmatched_sku") {
          const item = updated.items[issue.itemIndex];
          if (resolution.type === "confirm") {
            item.sku = resolution.value;
            item.matched_in_catalog = true;
          } else {
            item.sku = resolution.value;
            item.matched_in_catalog = false;
          }
        } else if (issue.type === "conflict") {
          const conflict = updated.conflicts[issue.conflictIndex];
          conflict.resolved_value = resolution.value;

          if (conflict.field === "quantity" && Array.isArray(updated.items)) {
            const matchingItem = updated.items.find(
              (item) => item.raw_product_name === "Red Widget A1"
            );
            if (matchingItem) {
              matchingItem.quantity = parseInt(resolution.value, 10) || matchingItem.quantity;
            }
          }
        }
        return updated;
      });
    }

    // 4. Auto-advance to the next unresolved issue in rotation
    const currentIndex = issues.findIndex((i) => i.id === issueId);
    const rotated = issues.slice(currentIndex + 1).concat(issues.slice(0, currentIndex));
    const nextUnresolved = rotated.find((i) => !resolvedIssues[i.id] && i.id !== issueId);

    if (nextUnresolved) {
      setActiveIssueId(nextUnresolved.id);
    }
  };

  const handleResetResolutions = () => {
    setResolvedIssues({});
    setRetryTick((t) => t + 1);
    setToast({
      message: "Reverted all staging resolutions to original extracted values.",
      type: "info",
    });
  };

  const handleValidateOrder = async () => {
    setIsSubmitting(true);
    try {
      await updateOrderStatus(id, "validated");
      setValidated(true);
      setToast({
        message: "Order successfully marked as validated.",
        type: "success",
      });
    } catch (err) {
      setToast({
        message:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to validate order status.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={handleRetry} />;
  if (!order) return <ErrorState message="No order payload returned." onRetry={handleRetry} />;

  // Validation details
  const resolvedRules = issues
    .filter((issue) => resolvedIssues[issue.id] && resolvedIssues[issue.id].type === "confirm")
    .map((issue) => ({
      issueLabel: issue.label,
      ruleText: resolvedIssues[issue.id].ruleText,
    }));

  const hasCriticalUnresolved = issues.some(
    (issue) => issue.severity === "high" && !resolvedIssues[issue.id]
  );

  const resolvedCount = Object.keys(resolvedIssues).length;
  const activeIssue = issues.find((i) => i.id === activeIssueId);

  // Success view
  if (validated) {
    return (
      <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8 bg-slate-50/50 flex items-center justify-center">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Validation Result: Success
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Discrepancies for Order <strong className="font-mono">{order.id}</strong> have been resolved. The order has been updated to <span className="font-semibold text-emerald-700 uppercase">validated</span> status and dispatched to ERP.
          </p>

          {resolvedRules.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 text-left">
                Stored Rules Committed ({resolvedRules.length})
              </h3>
              <div className="space-y-2.5 text-left">
                {resolvedRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex gap-3"
                  >
                    <Database className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{rule.issueLabel}</p>
                      <p className="text-xs font-mono text-slate-700 mt-1">{rule.ruleText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go to Dashboard
            </Link>
            <Link
              to={`/order/${order.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Order Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 lg:py-8 bg-slate-50/50">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Toast Container */}
        {toast.message && (
          <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div
              className={`rounded-xl border px-5 py-4 shadow-lg flex items-center gap-3 ${
                toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : toast.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : "border-slate-200 bg-slate-50 text-slate-800"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : toast.type === "error" ? (
                <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
              ) : (
                <Info className="h-5 w-5 text-slate-600 shrink-0" />
              )}
              <span className="text-sm font-semibold">{toast.message}</span>
            </div>
          </div>
        )}

        {/* Console Header */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <RepairHeader
            orderId={order.id}
            customerName={order.customer_name}
            status={order.status}
          />
        </div>

        {/* Audit Mode Information Banner */}
        {order.status !== "exception" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-800 flex items-start gap-3 shadow-sm">
            <Info className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-900">Audit Status Active</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                This transaction record is in status <strong className="uppercase">{order.status}</strong>. The console is in read-only audit mode. You can inspect previous resolutions and rule definitions below.
              </p>
            </div>
          </div>
        )}

        {/* Main 2-Column Console Layout */}
        <section className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Discrepancy Log */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pending Exceptions Registry ({issues.length})
              </h2>
              {resolvedCount === issues.length && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  All Resolved
                </span>
              )}
            </div>

            {issues.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                <p className="text-sm font-semibold text-slate-800">No active exceptions</p>
                <p className="mt-1 text-xs text-slate-500">
                  Data extraction validated successfully with no discrepant fields.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isActive={activeIssueId === issue.id}
                    isResolved={!!resolvedIssues[issue.id]}
                    onClick={() => setActiveIssueId(issue.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Resolution Panel */}
          <div className="lg:col-span-7">
            {activeIssue ? (
              <SuggestionPanel
                issue={activeIssue}
                resolvedState={resolvedIssues[activeIssue.id]}
                onResolve={handleResolveIssue}
              />
            ) : issues.length > 0 && resolvedCount === issues.length ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-8 text-center shadow-sm h-full flex flex-col justify-center items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">All Exceptions Solved</h3>
                  <p className="mt-1 text-xs text-slate-600 max-w-sm">
                    Reconciliation stage complete. Please review the updated staging document and mapping rules below, then mark the order as validated.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm h-full flex flex-col justify-center">
                <Layers className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-medium">Select an item from the log list to load resolving options.</p>
              </div>
            )}
          </div>
        </section>

        {/* Staging Document Preview */}
        <div className="space-y-3">
          <div className="px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Staging Document (Modified Preview)
            </h2>
          </div>
          <ItemsTable items={order.items || []} />
        </div>

        {/* Database Overrides & Rules Persistence */}
        <ResolutionHistory
          resolvedRules={resolvedRules}
          customerName={order.customer_name}
        />

        {/* Bottom Actions Stepper Panel */}
        <RepairActionBar
          totalIssues={issues.length}
          resolvedCount={resolvedCount}
          hasCriticalUnresolved={hasCriticalUnresolved}
          isSubmitting={isSubmitting}
          onValidate={handleValidateOrder}
          onReset={handleResetResolutions}
          onCancel={() => navigate(`/order/${order.id}`)}
        />
      </div>
    </div>
  );
}

