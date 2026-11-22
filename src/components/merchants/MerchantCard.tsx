"use client";

import { useEffect, useState } from "react";
import { Navigation, Phone, Clock } from "lucide-react";
import { Button, Card } from "@/components/ui";
import StatusBadge from "./StatusBadge";
import VisitModal from "@/components/visits/VisitModal";
import VisitHistory from "@/components/visits/VisitHistory";
import type { MerchantDto } from "@/lib/types";

const idr = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

interface VisitRecord {
  id: string;
  visitDate: string;
  visitorName: string;
  rootCause: string;
  actionTaken: string;
  notes: string | null;
}

export default function MerchantCard({ merchant, onVisitLogged }: { merchant: MerchantDto; onVisitLogged?: () => void }) {
  const [tab, setTab] = useState<"detail" | "history">("detail");
  const [modalOpen, setModalOpen] = useState(false);
  const [visits, setVisits] = useState<VisitRecord[]>([]);

  useEffect(() => {
    if (tab === "history") {
      fetch(`/api/visits?merchantId=${merchant.id}`)
        .then((r) => r.json())
        .then((data) => setVisits(Array.isArray(data) ? data : []))
        .catch(() => setVisits([]));
    }
  }, [tab, merchant.id]);

  const navUrl = merchant.latitude !== null && merchant.longitude !== null
    ? `https://www.google.com/maps/dir/?api=1&destination=${merchant.latitude},${merchant.longitude}`
    : null;

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{merchant.merchantName}</h3>
          <p className="text-xs text-slate-400">{merchant.productType.replace("_", " ")} · {merchant.mid}</p>
        </div>
        <StatusBadge status={merchant.healthStatus} />
      </div>

      <div className="flex gap-2 text-xs" role="tablist">
        <button role="tab" aria-selected={tab === "detail"} onClick={() => setTab("detail")} className={`cursor-pointer rounded px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${tab === "detail" ? "bg-slate-100 text-slate-900" : "text-slate-400"}`}>Detail</button>
        <button role="tab" aria-selected={tab === "history"} onClick={() => setTab("history")} className={`cursor-pointer rounded px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${tab === "history" ? "bg-slate-100 text-slate-900" : "text-slate-400"}`}>Visit History</button>
      </div>

      {tab === "detail" ? (
        <dl className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div><dt className="text-slate-500">Current volume</dt><dd className="font-semibold text-slate-100">{idr.format(merchant.salesVolumeCurrent)}</dd></div>
          <div><dt className="text-slate-500">Previous volume</dt><dd>{idr.format(merchant.salesVolumePrevious)}</dd></div>
          <div><dt className="text-slate-500">Drop</dt><dd className={merchant.dropPercentage > 0 ? "text-red-400" : "text-green-400"}>{merchant.dropPercentage.toFixed(1)}%</dd></div>
          <div><dt className="text-slate-500">Transactions</dt><dd>{merchant.txCountCurrent} / {merchant.txCountPrevious}</dd></div>
          <div className="col-span-2"><dt className="text-slate-500">Address</dt><dd>{merchant.businessAddress}</dd></div>
          <div><dt className="text-slate-500">Distance</dt><dd>{merchant.distanceMeters !== null ? `${Math.round(merchant.distanceMeters)} m` : "—"}</dd></div>
          {merchant.contactPhone ? <div className="flex items-center gap-1"><Phone className="h-3 w-3" aria-hidden="true" /><dd>{merchant.contactPhone}</dd></div> : null}
          {merchant.lastVisitedAt ? <div className="col-span-2 flex items-center gap-1 text-green-400"><Clock className="h-3 w-3" aria-hidden="true" />Visited {new Date(merchant.lastVisitedAt).toLocaleDateString("id-ID")}</div> : null}
        </dl>
      ) : (
        <VisitHistory visits={visits} />
      )}

      <div className="flex gap-2">
        {navUrl ? (
          <a href={navUrl} target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-slate-900 transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
            <Navigation className="h-3 w-3" aria-hidden="true" /> Navigate
          </a>
        ) : null}
        <Button variant="secondary" onClick={() => setModalOpen(true)}>Log Visit</Button>
      </div>

      <VisitModal
        open={modalOpen}
        merchantId={merchant.id}
        merchantName={merchant.merchantName}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); onVisitLogged?.(); }}
      />
    </Card>
  );
}
