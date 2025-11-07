export function PricingCta() {
  return (
    <section className="overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 p-1 backdrop-blur-xl">
      <div className="rounded-[calc(1.5rem-4px)] bg-slate-900/90 p-10 text-center md:p-16">
        <h2 className="mb-4 text-4xl font-accent text-white md:text-5xl">Ready to Ride?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
          Connect with our Hero dealership partners in Delhi to get personalized finance options, exchange offers, and test ride appointments.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:sales@hero-price-check.com"
            className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
          >
            <span className="relative z-10 font-accent text-2xl">Get Best Quote</span>
            <svg className="relative z-10 h-5 w-5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 transition-opacity group-hover/btn:opacity-100" />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
          >
            View More Models
          </a>
        </div>
      </div>
    </section>
  );
}
