export const HEALTH_COLORS = { RED: "#DC2626", YELLOW: "#D97706", GREEN: "#10B981" } as const;

/** Circular health marker. Styling lives in globals.css (.map-marker). */
export function pinIconHtml(status: "RED" | "YELLOW" | "GREEN", selected: boolean, pulse: boolean): string {
  const color = HEALTH_COLORS[status];
  const pulseRing = pulse && status === "RED" ? '<span class="pin-red-active absolute inset-0 rounded-full"></span>' : "";
  return `<div class="map-marker" style="--marker-color:${color}" data-selected="${selected}">${pulseRing}</div>`;
}

export function branchIconHtml(): string {
  return '<div class="map-branch" aria-hidden="true"></div>';
}
