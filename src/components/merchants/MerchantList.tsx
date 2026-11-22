"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input, Tabs } from "@/components/ui";
import StatusBadge from "./StatusBadge";
import type { MerchantDto } from "@/lib/types";

interface Props {
  merchants: MerchantDto[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  statusFilter: string;
  onStatusFilter: (s: string) => void;
  productFilter: string;
  onProductFilter: (s: string) => void;
  search: string;
  onSearch: (s: string) => void;
}

export default function MerchantList({ merchants, selectedId, onSelect, statusFilter, onStatusFilter, productFilter, onProductFilter, search, onSearch }: Props) {
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
    <aside className="flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-slate-800 bg-[#0E1223] p-3" aria-label="Merchant list">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <Input
          aria-label="Search merchants"
          placeholder="Search name, CIF, MID"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <Tabs
        active={statusFilter}
        onChange={onStatusFilter}
        tabs={[
          { key: "ALL", label: "All", count: counts.ALL },
          { key: "RED", label: "Needs Visit", count: counts.RED },
          { key: "YELLOW", label: "Watchlist", count: counts.YELLOW },
          { key: "GREEN", label: "Healthy", count: counts.GREEN },
        ]}
      />
      <div className="flex flex-wrap gap-1" role="group" aria-label="Product filter">
        {["ALL", "EDC", "LIVIN_MERCHANT", "BOTH"].map((p) => (
          <button
            key={p}
            onClick={() => onProductFilter(p)}
            className={`cursor-pointer rounded-full px-2 py-1 text-[11px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${productFilter === p ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-400"}`}
          >
            {p === "LIVIN_MERCHANT" ? "Livin'" : p === "ALL" ? "All products" : p}
          </button>
        ))}
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto" role="listbox" aria-label="Merchants sorted by distance">
        {merchants.map((m) => (
          <li key={m.id}>
            <button
              role="option"
              aria-selected={m.id === selectedId}
              onClick={() => onSelect(m.id)}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${m.id === selectedId ? "bg-slate-800" : "hover:bg-slate-800/60"}`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-100">{m.merchantName}</span>
                <span className="block text-[11px] text-slate-500">{m.distanceMeters !== null ? `${Math.round(m.distanceMeters)} m` : "No coordinates"}</span>
              </span>
              <StatusBadge status={m.healthStatus} />
            </button>
          </li>
        ))}
        {merchants.length === 0 ? <li className="px-2 py-4 text-center text-xs text-slate-500">No merchants match.</li> : null}
      </ul>
    </aside>
  );
}
