import { formatRelativeDate } from "@/lib/utils/pricing";

type HeroIntroProps = {
  city: string;
  modelName: string;
  lastUpdatedAt: Date;
};

export function HeroIntro({ city, modelName, lastUpdatedAt }: HeroIntroProps) {
  return (
    <section className="mb-16 text-center">
      <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-5 py-3 backdrop-blur-sm">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
        </span>
        <span className="font-accent text-xl text-emerald-300">
          Live Pricing • Updated {formatRelativeDate(lastUpdatedAt)}
        </span>
      </div>

      <h1 className="mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-7xl">
        {modelName}
      </h1>

      <p className="mx-auto mb-4 max-w-2xl text-lg text-slate-300 md:text-xl">
        On-Road Price in <span className="font-semibold text-white">{city}</span>
      </p>

      <p className="mx-auto max-w-3xl text-base text-slate-400">
        Real-time pricing from authorized Hero MotoCorp dealerships. Transparent breakdown of ex-showroom cost, insurance, RTO taxes, and registration fees.
      </p>
    </section>
  );
}
