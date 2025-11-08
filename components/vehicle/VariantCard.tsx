import { VariantDetail } from "@/lib/services/vehiclePricingService";
import { formatCurrency } from "@/lib/utils/pricing";

type VariantCardProps = {
  brandName?: string;
  modelName: string;
  currency: string;
  detail: VariantDetail;
};

export function VariantCard({ brandName, modelName, currency, detail }: VariantCardProps) {
  const title = [brandName, modelName, detail.variant].filter(Boolean).join(" ");

  const specItems = [
    { label: "Engine", value: detail.engineCc ? `${detail.engineCc} cc` : undefined },
    { label: "Power", value: detail.power },
    { label: "Torque", value: detail.torque },
    { label: "Mileage", value: detail.mileage },
    { label: "Fuel Type", value: detail.fuelType },
    { label: "Transmission", value: detail.transmission },
  ].filter((item) => Boolean(item.value));

  const priceItems = [
    { label: "Ex-showroom", amount: detail.exShowroomPrice },
    { label: "RTO / Registration", amount: detail.registration },
    { label: "Insurance", amount: detail.insurance },
    { label: "Other charges", amount: detail.otherCharges },
    { label: "On-road price", amount: detail.onRoadPrice, highlight: true },
  ].filter((item) => item.amount !== undefined && !Number.isNaN(Number(item.amount)));

  const optionalHighlights = [
    { label: "Kerb weight", value: detail.kerbWeight },
    { label: "Fuel tank", value: detail.fuelTankCapacity },
    {
      label: "Brakes",
      value:
        detail.brakeType?.front || detail.brakeType?.rear
          ? [detail.brakeType?.front, detail.brakeType?.rear]
              .filter(Boolean)
              .map((text, index) => (index === 0 ? `Front: ${text}` : `Rear: ${text}`))
              .join(" · ")
          : undefined,
    },
  ].filter((item) => Boolean(item.value));

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8">
      <div className="mb-6 flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#1A73E8]/10 px-3 py-1 text-sm font-medium text-[#1A73E8]">
          On-road: {formatCurrency(detail.onRoadPrice, currency)}
        </span>
      </div>

      {specItems.length > 0 ? (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Key specs</h3>
          <dl className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {specItems.map((spec) => (
              <div key={spec.label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{spec.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Price breakdown</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left text-sm text-slate-700">
            <tbody>
              {priceItems.map((item) => (
                <tr key={item.label} className="border-b border-slate-100 last:border-0">
                  <th className="px-4 py-3 font-medium text-slate-600">{item.label}</th>
                  <td className={`px-4 py-3 text-right ${item.highlight ? "font-semibold text-slate-900" : ""}`}>
                    {formatCurrency(item.amount as number, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail.features && detail.features.length > 0 ? (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Highlights</h3>
          <ul className="flex flex-wrap gap-2">
            {detail.features.map((feature) => (
              <li
                key={feature}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {detail.colorOptions && detail.colorOptions.length > 0 ? (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Color options</h3>
          <ul className="flex flex-wrap gap-2">
            {detail.colorOptions.map((color) => (
              <li
                key={color}
                className="rounded-full border border-[#1A73E8]/20 bg-[#1A73E8]/10 px-4 py-2 text-sm font-medium text-[#1A73E8]"
              >
                {color}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {optionalHighlights.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {optionalHighlights.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
