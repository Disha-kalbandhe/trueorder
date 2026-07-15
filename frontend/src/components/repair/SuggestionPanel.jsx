import React, { useState, useEffect } from "react";
import { Check, ShieldAlert, HardDrive, FileText, ArrowRight, Layers } from "lucide-react";

export default function SuggestionPanel({ issue, resolvedState, onResolve }) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Generate candidate list based on issue type
  const getCandidates = () => {
    if (issue.type === "unmatched_sku") {
      const { rawName } = issue;
      if (rawName.includes("Red Widget")) {
        return [
          {
            sku: "SKU-9021",
            productName: "Red Widget A1 Premium",
            confidence: 0.94,
            reason: "Exact catalog match found in customer order history for Sharma Traders.",
          },
          {
            sku: "SKU-9022",
            productName: "Red Widget A1 Standard",
            confidence: 0.81,
            reason: "Fuzzy text match in manufacturer catalog inventory index.",
          },
        ];
      } else if (rawName.includes("Copper Wire")) {
        return [
          {
            sku: "SKU-4412",
            productName: "Copper Wire D4 Heavy Duty",
            confidence: 0.89,
            reason: "Primary billing SKU mapping match for Global Traders.",
          },
          {
            sku: "SKU-4413",
            productName: "Copper Wire D4 Thin Core",
            confidence: 0.73,
            reason: "Fuzzy text database match with trailing character check.",
          },
        ];
      } else {
        // Dynamic fallback candidates
        const cleanName = rawName || "Catalog Item";
        return [
          {
            sku: "SKU-801",
            productName: `${cleanName} Premium`,
            confidence: 0.92,
            reason: "Recommended catalog match by inventory alignment.",
          },
          {
            sku: "SKU-802",
            productName: `${cleanName} Standard`,
            confidence: 0.78,
            reason: "Secondary match suggestion in database listing.",
          },
        ];
      }
    } else if (issue.type === "conflict") {
      const { pdfValue, emailValue, field } = issue;
      return [
        {
          id: "email",
          value: emailValue,
          label: `Email Instruction Override: ${emailValue}`,
          confidence: 0.98,
          source: "Email Intent",
          reason: "Customer explicitly specified this override value in email body.",
        },
        {
          id: "pdf",
          value: pdfValue,
          label: `Original PDF Specification: ${pdfValue}`,
          confidence: 0.65,
          source: "PDF Specification",
          reason: "Extracted value from physical attachment before email revision.",
        },
      ];
    }
    return [];
  };

  const candidates = getCandidates();

  // Reset selected option when issue changes or loaded with pre-existing resolution
  useEffect(() => {
    if (resolvedState) {
      if (issue.type === "unmatched_sku") {
        const found = candidates.find(c => c.sku === resolvedState.value);
        setSelectedOption(found || null);
      } else {
        const found = candidates.find(c => c.value === resolvedState.value);
        setSelectedOption(found || null);
      }
    } else {
      setSelectedOption(candidates[0] || null);
    }
  }, [issue.id, resolvedState]);

  if (!issue) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
        <p className="text-sm font-medium">Select an item from the registry list to load suggested mappings.</p>
      </div>
    );
  }

  const handleConfirm = () => {
    if (!selectedOption) return;

    let resolutionValue = "";
    let displayLabel = "";
    let ruleText = "";

    if (issue.type === "unmatched_sku") {
      resolutionValue = selectedOption.sku;
      displayLabel = `Catalog SKU Mapped: ${selectedOption.sku} (${selectedOption.productName})`;
      ruleText = `Store rule: Map customer raw product name "${issue.rawName}" to catalog SKU "${selectedOption.sku}"`;
    } else {
      resolutionValue = selectedOption.value;
      displayLabel = `Conflict Resolved: Applied ${selectedOption.source} override value (${selectedOption.value})`;
      ruleText = `Store rule: Apply email override for "${issue.field}" when explicit email intent supercedes PDF attachment`;
    }

    onResolve(issue.id, {
      type: "confirm",
      value: resolutionValue,
      displayLabel,
      ruleText,
      candidate: selectedOption,
    });
  };

  const handleKeepCurrent = () => {
    onResolve(issue.id, {
      type: "keep",
      value: issue.extractedValue,
      displayLabel: `Retained Extracted Value: ${issue.extractedValue}`,
      ruleText: `No rule stored. Retained current value.`,
      candidate: { productName: issue.extractedValue, sku: "KEEP_CURRENT" },
    });
  };

  const handleManualReview = () => {
    onResolve(issue.id, {
      type: "review",
      value: "MANUAL_REVIEW",
      displayLabel: `Escalated discrepancy to manual review queue`,
      ruleText: `Escalate to operations queue.`,
      candidate: { productName: "Flagged for manual review", sku: "MANUAL_REVIEW" },
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <Layers className="h-5 w-5 text-slate-700" />
        <div>
          <h2 className="font-bold text-slate-900 text-base">Suggested Catalog Mapping & Resolution</h2>
          <p className="text-xs text-slate-500">Select mapping correction or override options below</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Suggested Mapping Options
          </p>
          <div className="space-y-3">
            {candidates.map((cand, idx) => {
              const isSelected = issue.type === "unmatched_sku"
                ? selectedOption?.sku === cand.sku
                : selectedOption?.value === cand.value;

              const displayTitle = issue.type === "unmatched_sku"
                ? `${cand.sku} — ${cand.productName}`
                : cand.label;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedOption(cand)}
                  className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-150 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/30 shadow-sm"
                      : "border-slate-200 bg-slate-50/20 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {issue.type === "unmatched_sku" ? (
                          <HardDrive className="h-4 w-4 text-slate-500 shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                        )}
                        <span className="text-sm font-bold text-slate-950 break-words leading-tight">
                          {displayTitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-normal">
                        {cand.reason}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">Match:</span>
                        <span
                          className={`text-xs font-extrabold ${
                            cand.confidence >= 0.9
                              ? "text-emerald-700"
                              : cand.confidence >= 0.75
                                ? "text-blue-700"
                                : "text-amber-700"
                          }`}
                        >
                          {Math.round(cand.confidence * 100)}%
                        </span>
                      </div>
                      
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation Analysis Callout */}
        {selectedOption && (
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Layers className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span>Validation Analysis</span>
            </div>
            <p className="leading-relaxed">
              {issue.type === "unmatched_sku"
                ? `Catalog matching algorithm mapped "${issue.rawName}" to SKU "${selectedOption.sku}" (match confidence: ${Math.round(selectedOption.confidence * 100)}%) using customer history.`
                : `Override instruction rule matched. Customer email override (${issue.emailValue}) supercedes PDF extracted value (${issue.pdfValue}) per standard operational fusion guidelines.`}
            </p>
          </div>
        )}

        {/* Action Panel */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Check className="h-4 w-4 stroke-[3.5]" />
            Apply Mapping Override
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleKeepCurrent}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm"
            >
              Retain Extracted Value
            </button>
            <button
              type="button"
              onClick={handleManualReview}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-50 shadow-sm"
            >
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              Route to Manual Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

