import { Layers3, PackageSearch } from "lucide-react";

function formatCurrency(value) {
  if (typeof value !== "number") return "Not available";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function MatchBadge({ matched }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${matched ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
    >
      {matched ? "Matched" : "Unmatched"}
    </span>
  );
}

export default function ItemsTable({ items = [] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Items
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            Structured order lines
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          <Layers3 className="h-3.5 w-3.5" />
          {items.length} line item{items.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="p-6">
        {items.length ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_96px_120px_120px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span>Product name</span>
              <span>SKU</span>
              <span className="text-right">Quantity</span>
              <span className="text-right">Unit price</span>
              <span className="text-right">Match status</span>
            </div>
            <div className="divide-y divide-slate-200 bg-white">
              {items.map((item, index) => (
                <div
                  key={`${item.raw_product_name}-${index}`}
                  className={`grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_96px_120px_120px] gap-4 px-4 py-4 ${item.matched_in_catalog ? "" : "bg-amber-50/50"}`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {item.raw_product_name}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-700">
                      {item.sku || "Unmatched"}
                    </p>
                  </div>
                  <p className="text-right text-sm font-medium text-slate-700">
                    {item.quantity}
                  </p>
                  <p className="text-right text-sm font-medium text-slate-700">
                    {formatCurrency(item.unit_price)}
                  </p>
                  <div className="flex justify-end">
                    <MatchBadge matched={item.matched_in_catalog} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
              <PackageSearch className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No structured items were extracted.
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The system did not return any line items for this order.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
