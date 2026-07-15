import React from "react";
import { PlusCircle, Info, Database } from "lucide-react";

export default function ResolutionHistory({ resolvedRules, customerName }) {
  const hasRules = Array.isArray(resolvedRules) && resolvedRules.length > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <Database className="h-5 w-5 text-slate-700" />
        <div>
          <h2 className="font-bold text-slate-900 text-base">Proposed Database Rules</h2>
          <p className="text-xs text-slate-500">
            Rules and overrides to be committed to the database upon validation
          </p>
        </div>
      </div>

      <div className="mt-5">
        {!hasRules ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
            <Info className="h-6 w-6 mx-auto mb-2 text-slate-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              No Persistent Rules Configured
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Apply mapping overrides in the resolution panel to stage permanent database mapping rules.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-700 leading-normal flex items-start gap-2">
              <PlusCircle className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
              <span>
                <strong>Database Action:</strong> The mapping rules and override resolutions documented below will be committed to the customer database for <strong>{customerName || "this customer"}</strong>.
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th scope="col" className="px-4 py-3">Customer Scope</th>
                    <th scope="col" className="px-4 py-3">Discrepancy Source</th>
                    <th scope="col" className="px-4 py-3">Stored Rule Action</th>
                    <th scope="col" className="px-4 py-3 text-right">Commit State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
                  {resolvedRules.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">
                        {customerName || " शर्मा ट्रेडर्स"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">
                        {rule.issueLabel}
                      </td>
                      <td className="px-4 py-3 text-slate-950 font-mono text-[11px] leading-relaxed">
                        {rule.ruleText}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200">
                          Pending Commit
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

