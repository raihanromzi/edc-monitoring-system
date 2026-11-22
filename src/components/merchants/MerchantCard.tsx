"use client";

import { useEffect, useState } from "react";
import { Clock, Navigation, Phone, X } from "lucide-react";
import { Button, Tabs } from "@/components/ui";
import StatusBadge from "./StatusBadge";
import VisitModal from "@/components/visits/VisitModal";
import VisitHistory from "@/components/visits/VisitHistory";
import { formatDistance, formatIdr } from "@/lib/format";
import type { MerchantDto } from "@/lib/types";

interface VisitRecord {
  id: string;
  visitDate: string;
  visitorName: string;
  rootCause: string;
  actionTaken: string;
  notes: string | null;
}

export default function MerchantCard({
  merchant,
  onVisitLogged,
  onClose,
}: {
  merchant: MerchantDto;
  onVisitLogged?: () => void;
  onClose?: () => void;
}) {
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

  const dropIsNegative = merchant.dropPercentage > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5">
            <StatusBadge status={merchant.healthStatus} />
          </div>
          <h2 className="text-[15px] font-semibold leading-tight text-ink">{merchant.merchantName}</h2>
          <p className="num mt-1 text-[11px] text-ink-secondary">
            {merchant.productType.replace("_", " ")} · MID {merchant.mid}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="btn-icon h-8 w-8 shrink-0 rounded-[10px]"
            aria-label="Close merchant details"
            title="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <Tabs
        className="grid grid-cols-2 gap-1.5"
        active={tab}
        onChange={(k) => setTab(k as "detail" | "history")}
        tabs={[
          { key: "detail", label: "Detail" },
          { key: "history", label: "Visit history" },
        ]}
      />

      {tab === "detail" ? (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
          <div className="rounded-control bg-subtle p-2.5">
            <dt className="text-[11px] text-ink-muted">Current volume</dt>
            <dd className="num mt-0.5 font-semibold text-ink">{formatIdr(merchant.salesVolumeCurrent)}</dd>
          </div>
          <div className="rounded-control bg-subtle p-2.5">
            <dt className="text-[11px] text-ink-muted">Previous volume</dt>
            <dd className="num mt-0.5 text-ink-secondary">{formatIdr(merchant.salesVolumePrevious)}</dd>
          </div>
          <div className="rounded-control bg-subtle p-2.5">
            <dt className="text-[11px] text-ink-muted">Drop</dt>
            <dd className={`num mt-0.5 font-semibold ${dropIsNegative ? "text-red-700" : "text-emerald-700"}`}>
              {merchant.dropPercentage.toFixed(1)}%
            </dd>
          </div>
          <div className="rounded-control bg-subtle p-2.5">
            <dt className="text-[11px] text-ink-muted">Transactions</dt>
            <dd className="num mt-0.5 text-ink-secondary">
              {merchant.txCountCurrent} / {merchant.txCountPrevious}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[11px] text-ink-muted">Address</dt>
            <dd className="mt-0.5 leading-snug text-ink-secondary">{merchant.businessAddress}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-ink-muted">Distance</dt>
            <dd className="num mt-0.5 text-ink-secondary">{formatDistance(merchant.distanceMeters)}</dd>
          </div>
          {merchant.contactPhone ? (
            <div>
              <dt className="text-[11px] text-ink-muted">Phone</dt>
              <dd className="num mt-0.5 flex items-center gap-1 text-ink-secondary">
                <Phone className="h-3 w-3" aria-hidden="true" />
                {merchant.contactPhone}
              </dd>
            </div>
          ) : null}
          {merchant.lastVisitedAt ? (
            <div className="col-span-2 flex items-center gap-1.5 text-emerald-700">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Visited {new Date(merchant.lastVisitedAt).toLocaleDateString("id-ID")}
            </div>
          ) : null}
        </dl>
      ) : (
        <VisitHistory visits={visits} />
      )}

      <div className="grid grid-cols-2 gap-2">
        {navUrl ? (
          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-[13px]"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" /> Navigate
          </a>
        ) : (
          <span className="flex h-10 items-center justify-center rounded-control border border-dashed border-control text-[12px] text-ink-muted">
            No coordinates
          </span>
        )}
        <Button variant="secondary" onClick={() => setModalOpen(true)}>Log visit</Button>
      </div>

      <VisitModal
        open={modalOpen}
        merchantId={merchant.id}
        merchantName={merchant.merchantName}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); onVisitLogged?.(); }}
      />
    </div>
  );
}
