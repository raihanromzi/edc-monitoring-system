"use client";

import { Badge } from "@/components/ui";

const STYLES = {
  RED: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/15",
  YELLOW: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/15",
  GREEN: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15",
} as const;

const DOT = {
  RED: "bg-red-600",
  YELLOW: "bg-amber-600",
  GREEN: "bg-emerald-600",
} as const;

const LABELS = { RED: "Needs visit", YELLOW: "Watchlist", GREEN: "Healthy" } as const;

export default function StatusBadge({ status }: { status: "RED" | "YELLOW" | "GREEN" }) {
  return (
    <Badge className={`h-[22px] px-2 text-[11px] font-semibold ${STYLES[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} aria-hidden="true" />
      {LABELS[status]}
    </Badge>
  );
}
