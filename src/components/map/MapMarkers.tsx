export const HEALTH_COLORS = { RED: "#EF4444", YELLOW: "#F59E0B", GREEN: "#22C55E" } as const;

export function pinIconHtml(status: "RED" | "YELLOW" | "GREEN", pulse: boolean): string {
  const color = HEALTH_COLORS[status];
  return `<div class="relative flex h-8 w-8 items-center justify-center">
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C7.6 2 4 5.6 4 10c0 5.2 8 12 8 12s8-6.8 8-12c0-4.4-3.6-8-8-8z" fill="${color}" stroke="#020617" stroke-width="1.5"/>
      <circle cx="12" cy="10" r="3.5" fill="#020617"/>
    </svg>
    ${pulse && status === "RED" ? '<span class="pin-red-active absolute h-8 w-8 rounded-full"></span>' : ""}
  </div>`;
}
