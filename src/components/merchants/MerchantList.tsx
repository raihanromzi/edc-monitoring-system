"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import { Input, Tabs, cn } from "@/components/ui";
import StatusBadge from "./StatusBadge";
import { formatDistance, formatIdrCompact } from "@/lib/format";
import type { MerchantDto } from "@/lib/types";

const PRODUCT_FILTERS = [
  { key: "ALL", label: "All products" },
  { key: "EDC", label: "EDC" },
  { key: "LIVIN_MERCHANT", label: "Livin'" },
  { key: "BOTH", label: "Both" },
] as const;

interface Props {
  merchants: MerchantDto[];
  total: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  statusFilter: string;
  onStatusFilter: (s: string) => void;
  productFilter: string;
  onProductFilter: (s: string) => void;
  search: string;
  onSearch: (s: string) => void;
}

export default function MerchantList({
  merchants,
  total,
  selectedId,
  onSelect,
  statusFilter,
  onStatusFilter,
  productFilter,
  onProductFilter,
  search,
  onSearch,
}: Props) {
  const counts = useMemo(
    () => ({
      ALL: merchants.length,
      RED: merchants.filter((m) => m.healthStatus === "RED").length,
      YELLOW: merchants.filter((m) => m.healthStatus === "YELLOW").length,
      GREEN: merchants.filter((m) => m.healthStatus === "GREEN").length,
    }),
    [merchants],
  );

  return (
    <>
      <div className="space-y-3 p-4 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <Input
            aria-label="Search merchants"
            placeholder="Search name, CIF, MID"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs
          className="grid grid-cols-2 gap-1.5"
          active={statusFilter}
          onChange={onStatusFilter}
          tabs={[
            { key: "ALL", label: "All", count: counts.ALL },
            { key: "RED", label: "Needs visit", count: counts.RED },
            { key: "YELLOW", label: "Watchlist", count: counts.YELLOW },
            { key: "GREEN", label: "Healthy", count: counts.GREEN },
          ]}
        />

        <div className="flex gap-1.5" role="group" aria-label="Product filter">
          {PRODUCT_FILTERS.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={productFilter === p.key}
              onClick={() => onProductFilter(p.key)}
              className="chip flex-1 justify-center px-2 text-[11.5px]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 border-t border-slate-900/[0.08] px-4 pb-2 pt-3">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-ink">Merchants</h2>
          <p className="text-[11.5px] text-ink-secondary">
            <span className="num">{merchants.length}</span> of <span className="num">{total}</span> in view
          </p>
        </div>
        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
          <span className="num">{counts.RED}</span> needs visit
        </span>
      </div>

      <ul role="listbox" aria-label="Merchants" className="flex-1 space-y-2 overflow-y-auto px-3 pb-3">
        {merchants.map((m) => {
          const isSelected = m.id === selectedId;
          return (
            <li key={m.id}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect(m.id)}
                className={cn(
                  "w-full cursor-pointer rounded-card border p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt/60",
                  isSelected
                    ? "border-cobalt bg-white shadow-[0_4px_12px_rgba(37,99,235,0.12)]"
                    : "border-slate-900/[0.06] bg-white/70 hover:border-slate-300 hover:bg-white",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-ink">{m.merchantName}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-ink-secondary">{m.businessAddress}</p>
                  </div>
                  <p className="num shrink-0 text-[12px] font-semibold text-ink">{formatIdrCompact(m.salesVolumeCurrent)}</p>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <StatusBadge status={m.healthStatus} />
                  <span className="num truncate text-[11px] text-ink-muted">
                    {formatDistance(m.distanceMeters)} · {m.mid}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
        {merchants.length === 0 ? (
          <li className="px-4 py-10 text-center text-[12px] text-ink-secondary">No merchants match these filters.</li>
        ) : null}
      </ul>
    </>
  );
}
