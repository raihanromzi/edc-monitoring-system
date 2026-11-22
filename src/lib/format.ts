const idrFull = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const idrCompact = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 });

export function formatIdr(value: number): string {
  return idrFull.format(value);
}

export function formatIdrCompact(value: number): string {
  return idrCompact.format(value);
}

export function formatDistance(meters: number | null): string {
  return meters === null ? "No coordinates" : `${Math.round(meters)} m`;
}
