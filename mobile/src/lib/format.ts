// en-ZA formatters matching the web exactly.
const price = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});
const km = new Intl.NumberFormat("en-ZA");

export const formatPrice = (v: number) => price.format(v);
export const formatKm = (v: number) => `${km.format(v)} km`;
export const formatMileage = (l: { condition?: string; mileageKm: number }) =>
  l.condition === "new" && l.mileageKm === 0 ? "New" : formatKm(l.mileageKm);
