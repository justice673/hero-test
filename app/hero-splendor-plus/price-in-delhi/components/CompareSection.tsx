"use client";

import { useState } from "react";

import { CompareModal } from "./CompareModal";
import { popularBikeOptions, popularCarOptions } from "./compare-config";

const PRIMARY_BIKE = popularBikeOptions[0];
const PRIMARY_CAR = popularCarOptions[0];

export function CompareSection() {
  const [modalState, setModalState] = useState<{
    type: "bike" | "car";
    open: boolean;
  }>({ type: "bike", open: false });

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
            onClick={() => setModalState({ type: "bike", open: true })}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#1A73E8] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#155cc0] sm:text-base"
          >
            Compare Bikes
          </button>
          <button
            type="button"
            onClick={() => setModalState({ type: "car", open: true })}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#1A73E8] px-6 text-sm font-semibold text-[#1A73E8] transition hover:bg-[#1A73E8]/10 sm:text-base"
          >
            Compare Cars
          </button>
        </div>
      </div>

      <CompareModal
        type="bike"
        isOpen={modalState.open && modalState.type === "bike"}
        onClose={() => setModalState((prev) => ({ ...prev, open: false }))}
        options={popularBikeOptions}
        primarySelection={PRIMARY_BIKE}
        primaryLabel="Selected bike"
        ctaHref="https://www.zigwheels.com/compare-bikes"
      />
      <CompareModal
        type="car"
        isOpen={modalState.open && modalState.type === "car"}
        onClose={() => setModalState((prev) => ({ ...prev, open: false }))}
        options={popularCarOptions}
        primarySelection={PRIMARY_CAR}
        primaryLabel="Selected car"
        ctaHref="https://www.cardekho.com/compare-cars"
      />
    </section>
  );
}
