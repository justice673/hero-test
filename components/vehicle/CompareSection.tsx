"use client";

import { useMemo, useState } from "react";

import { CompareModal } from "./CompareModal";
import { popularBikeOptions, popularCarOptions, type VehicleOption } from "./compare-config";

type CompareSectionProps = {
  vehicleType: "bike" | "car";
  modelSlug: string;
  displayName: string;
};

function ensureOption(options: VehicleOption[], current: VehicleOption) {
  const exists = options.some((option) => option.value === current.value);
  return exists ? { options, primary: current } : { options: [current, ...options], primary: current };
}

export function CompareSection({ vehicleType, modelSlug, displayName }: CompareSectionProps) {
  const currentOption = useMemo<VehicleOption>(() => ({ value: modelSlug, label: displayName }), [modelSlug, displayName]);

  const bikeData = useMemo(() => {
    if (vehicleType === "bike") {
      return ensureOption(popularBikeOptions, currentOption);
    }

    return { options: popularBikeOptions, primary: popularBikeOptions[0] };
  }, [vehicleType, currentOption]);

  const carData = useMemo(() => {
    if (vehicleType === "car") {
      return ensureOption(popularCarOptions, currentOption);
    }

    return { options: popularCarOptions, primary: popularCarOptions[0] };
  }, [vehicleType, currentOption]);

  const [modalState, setModalState] = useState<{ open: boolean; type: "bike" | "car" }>({ open: false, type: vehicleType });

  const activeOptions = modalState.type === "bike" ? bikeData.options : carData.options;
  const activePrimary = modalState.type === "bike" ? bikeData.primary : carData.primary;
  const ctaHref = modalState.type === "bike" ? "https://www.zigwheels.com/compare-bikes" : "https://www.cardekho.com/compare-cars";
  const primaryLabel = modalState.type === "bike" ? "Selected bike" : "Selected car";

  return (
    <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Compare before you decide</h2>
          <p className="mt-2 text-slate-600">
            Build a quick shortlist of bikes or cars and continue the comparison on trusted platforms like ZigWheels or CarDekho.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => setModalState({ open: true, type: vehicleType })}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#1A73E8] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#155cc0] sm:text-base"
          >
            Compare {vehicleType === "bike" ? "Bikes" : "Cars"}
          </button>
          <button
            type="button"
            onClick={() => setModalState({ open: true, type: vehicleType === "bike" ? "car" : "bike" })}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#1A73E8] px-6 text-sm font-semibold text-[#1A73E8] transition hover:bg-[#1A73E8]/10 sm:text-base"
          >
            Compare {vehicleType === "bike" ? "Cars" : "Bikes"}
          </button>
        </div>
      </div>

      <CompareModal
        type={modalState.type}
        isOpen={modalState.open}
        onClose={() => setModalState((prev) => ({ ...prev, open: false }))}
        options={activeOptions}
        primarySelection={activePrimary}
        primaryLabel={primaryLabel}
        ctaHref={ctaHref}
      />
    </section>
  );
}
