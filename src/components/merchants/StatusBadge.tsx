"use client";

import { Badge } from "@/components/ui";

const STYLES = {
  RED: "bg-red-500/15 text-red-400",
  YELLOW: "bg-amber-500/15 text-amber-400",
  GREEN: "bg-green-500/15 text-green-400",
} as const;

const LABELS = { RED: "Needs Visit", YELLOW: "Watchlist", GREEN: "Healthy" } as const;

export default function StatusBadge({ status }: { status: "RED" | "YELLOW" | "GREEN" }) {
  return (
    <Badge className={STYLES[status]}>
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {LABELS[status]}
    </Badge>
  );
}
