"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck, Eye, Settings } from "lucide-react";
import MapContainer from "@/components/map/MapContainer";
import MerchantList from "@/components/merchants/MerchantList";
import MerchantCard from "@/components/merchants/MerchantCard";
import HeaderActions from "@/components/navigation/HeaderActions";
import { Card } from "@/components/ui";
import type { MerchantListResponse, MerchantDto } from "@/lib/types";

interface Branch {
  latitude: number;
  longitude: number;
  branchName: string;
  branchCode: string;
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

  if (loadError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card role="alert" className="flex max-w-sm items-center gap-2 text-sm text-red-700">
          <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
          {loadError}
        </Card>
      </div>
    );
  }

  if (!data || !branch) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Loading dashboard">
        <Card className="flex items-center gap-3 text-sm text-ink-secondary">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-cobalt" aria-hidden="true" />
          Loading merchants…
        </Card>
      </div>
    );
  }

  const { summary } = data;

  return (
    <>
      <div className="absolute inset-0 z-0">
        <MapContainer merchants={data.merchants} branch={branch} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      <aside
        aria-label="Merchant panel"
        className="glass-panel absolute bottom-4 left-4 top-4 z-20 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden max-md:bottom-2 max-md:left-2 max-md:right-2 max-md:top-auto max-md:h-[40dvh] max-md:w-auto max-md:max-w-none"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-900/[0.08] p-4 pb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-[-0.01em] text-ink">Mandiri EDC</h1>
              <span className="rounded-full bg-cobalt/10 px-2 py-0.5 text-[10px] font-semibold tracking-[0.05em] text-blue-700">LIVE</span>
            </div>
            <p className="mt-1 truncate text-[11.5px] text-ink-secondary">
              {branch.branchName} <span className="num">· {branch.branchCode}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <HeaderActions />
            <Link href="/settings" className="btn-icon" aria-label="Settings" title="Settings">
              <Settings className="h-[17px] w-[17px]" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <MerchantList
          merchants={data.merchants}
          total={summary.total}
          selectedId={selectedId}
          onSelect={setSelectedId}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          productFilter={productFilter}
          onProductFilter={setProductFilter}
          search={search}
          onSearch={setSearch}
        />

        <footer className="flex items-center justify-between gap-2 border-t border-slate-900/[0.08] bg-subtle/70 px-4 py-3 text-[11.5px] text-ink-secondary">
          <span className="flex items-center gap-1.5">
            <CircleAlert className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
            <span className="num font-semibold text-ink">{summary.redCount}</span> needs visit
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
            <span className="num font-semibold text-ink">{summary.yellowCount}</span> watchlist
          </span>
          <span className="flex items-center gap-1.5">
            <CircleCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span className="num font-semibold text-ink">{summary.greenCount}</span> healthy
          </span>
        </footer>
      </aside>

      {selected ? (
        <section
          aria-label={`Details for ${selected.merchantName}`}
          className="glass-panel absolute bottom-4 left-[412px] z-20 max-h-[calc(100%-2rem)] w-[340px] overflow-y-auto p-4 max-md:bottom-auto max-md:left-2 max-md:right-2 max-md:top-2 max-md:max-h-[55%] max-md:w-auto"
        >
          <MerchantCard merchant={selected} onVisitLogged={load} onClose={() => setSelectedId(null)} />
        </section>
      ) : null}
    </>
  );
}
