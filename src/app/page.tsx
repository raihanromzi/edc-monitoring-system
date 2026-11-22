"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import MapContainer from "@/components/map/MapContainer";
import MerchantList from "@/components/merchants/MerchantList";
import MerchantCard from "@/components/merchants/MerchantCard";
import { Card } from "@/components/ui";
import type { MerchantListResponse, MerchantDto } from "@/lib/types";

interface Branch {
  latitude: number;
  longitude: number;
  branchName: string;
}

export default function Dashboard() {
  const [data, setData] = useState<MerchantListResponse | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    const params = new URLSearchParams({ status: statusFilter, product: productFilter });
    if (search) params.set("search", search);
    const res = await fetch(`/api/merchants?${params}`);
    if (!res.ok) {
      setLoadError("Failed to load merchants.");
      return;
    }
    const json: MerchantListResponse = await res.json();
    setData(json);
    setLoadError("");
  }, [statusFilter, productFilter, search]);

  useEffect(() => {
    fetch("/api/branch-config").then((r) => r.json()).then(setBranch).catch(() => setBranch(null));
  }, []);

  useEffect(() => {
    const t = setTimeout(load, search ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const selected = useMemo<MerchantDto | null>(() => data?.merchants.find((m) => m.id === selectedId) ?? null, [data, selectedId]);

  if (loadError) return <Card className="mt-8 text-center text-sm text-red-300">{loadError}</Card>;

  if (!data || !branch) {
    return (
      <div className="flex h-[60vh] items-center justify-center" role="status" aria-label="Loading dashboard">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-green-500" aria-hidden="true" />
      </div>
    );
  }

  const stats = [
    ["Total merchants", data.summary.total, "text-slate-100"],
    ["Needs visit", data.summary.redCount, "text-red-400"],
    ["Watchlist", data.summary.yellowCount, "text-amber-400"],
    ["Healthy", data.summary.greenCount, "text-green-400"],
    ["Visits this month", data.summary.completedVisitsThisMonth, "text-slate-100"],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map(([label, value, cls]) => (
          <Card key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`text-xl font-semibold ${cls}`}>{value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="order-2 h-[70vh] overflow-hidden rounded-xl border border-slate-800 lg:order-1">
          <MapContainer merchants={data.merchants} branch={branch} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="order-1 flex max-h-[70vh] flex-col gap-4 lg:order-2">
          <div className="min-h-0 flex-1">
            <MerchantList
              merchants={data.merchants}
              selectedId={selectedId}
              onSelect={setSelectedId}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
              productFilter={productFilter}
              onProductFilter={setProductFilter}
              search={search}
              onSearch={setSearch}
            />
          </div>
          {selected ? <MerchantCard merchant={selected} onVisitLogged={load} /> : null}
        </div>
      </div>
    </div>
  );
}
