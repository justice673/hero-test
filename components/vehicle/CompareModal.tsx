"use client";

import { useMemo, useState } from "react";

import type { VehicleOption } from "./compare-config";

const PLACEHOLDER_IMAGE = "https://res.cloudinary.com/dmywuw6u3/image/upload/v1728567995/hero-price-check/vehicle-placeholder_qrhd5n.svg";

type CompareModalProps = {
  type: "bike" | "car";
  isOpen: boolean;
  onClose: () => void;
  options: VehicleOption[];
  primarySelection: VehicleOption;
  primaryLabel: string;
  ctaHref: string;
};

export function CompareModal({
  type,
  isOpen,
  onClose,
  options,
  primarySelection,
  primaryLabel,
  ctaHref,
}: CompareModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([primarySelection.value, "", ""]);

  const optionMap = useMemo(() => new Map(options.map((option) => [option.value, option.label])), [options]);

  if (!isOpen) {
    return null;
  }

  const handleSelect = (index: number, value: string) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const selections = selectedIds
    .map((id) => ({ id, label: id ? optionMap.get(id) ?? "" : "" }))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4 py-6">
      <div className="relative flex max-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Compare {type === "bike" ? "bikes" : "cars"}
            </h2>
            <p className="text-sm text-slate-500">
              Add up to three {type === "bike" ? "bikes" : "cars"} to compare specs, prices, and features.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="Close compare modal"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l8 8m0-8l-8 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="grid flex-1 gap-4 overflow-y-auto px-6 py-6 sm:grid-cols-3">
          {selections.map((selection, index) => {
            const isPrimary = index === 0;
            const label = isPrimary && selection.label ? selection.label : selection.label || `Add ${type} ${index + 1}`;

            return (
              <div
                key={index}
                className={`flex flex-col items-center rounded-2xl border ${
                  isPrimary ? "border-[#1A73E8] bg-[#1A73E8]/5" : "border-slate-200 bg-slate-50"
                } p-5 text-center`}
              >
                <div className="mb-4 flex h-28 w-48 items-center justify-center">
                  <img
                    src={PLACEHOLDER_IMAGE}
                    alt="Vehicle placeholder"
                    className="h-full w-full object-contain opacity-70"
                  />
                </div>
                <span className={`mb-3 text-sm font-medium ${isPrimary ? "text-[#1A73E8]" : "text-slate-500"}`}>
                  {isPrimary ? primaryLabel : "Optional"}
                </span>
                <select
                  value={selection.id}
                  onChange={(event) => handleSelect(index, event.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/30"
                >
                  <option value="">{isPrimary ? label : `Add ${type} ${index + 1}`}</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            You can refine comparisons further on ZigWheels or CarDekho once you pick the vehicles.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 sm:w-auto"
            >
              Cancel
            </button>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#1A73E8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#155cc0] sm:w-auto"
            >
              Compare now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
