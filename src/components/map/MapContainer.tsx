"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { MerchantDto } from "@/lib/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-sm text-slate-400" role="status" aria-label="Loading map">
      Loading map…
    </div>
  ),
});

interface Props {
  merchants: MerchantDto[];
  branch: { latitude: number; longitude: number };
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function MapContainerWrapper(props: Props) {
  const [adjustMode, setAdjustMode] = useState(false);
  const [draftPin, setDraftPin] = useState<{ id: string; lat: number; lng: number } | null>(null);
  const [saved, setSaved] = useState(false);

  async function savePin() {
    if (!draftPin) return;
    const res = await fetch(`/api/merchants/${draftPin.id}/coordinates`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude: draftPin.lat, longitude: draftPin.lng }),
    });
    setSaved(res.ok);
    if (res.ok) {
      const m = props.merchants.find((x) => x.id === draftPin.id);
      if (m) {
        m.latitude = draftPin.lat;
        m.longitude = draftPin.lng;
      }
      setDraftPin(null);
      setAdjustMode(false);
    }
  }

  return (
    <div className="relative h-full min-h-[420px] w-full">
      <LeafletMap
        {...props}
        adjustMode={adjustMode}
        onDropPin={(id, lat, lng) => {
          setDraftPin({ id, lat, lng });
          setSaved(false);
        }}
      />
      <div className="absolute right-2 top-2 z-[1000] flex flex-col items-end gap-2">
        {props.selectedId ? (
          <button
            onClick={() => {
              setAdjustMode((v) => !v);
              setDraftPin(null);
            }}
            className="cursor-pointer rounded-lg border border-slate-600 bg-[#0E1223] px-3 py-2 text-xs font-semibold text-slate-200 shadow-lg transition-colors duration-200 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-pressed={adjustMode}
          >
            {adjustMode ? "Cancel Pin Adjustment" : "Adjust Pin Location"}
          </button>
        ) : null}
        {draftPin ? (
          <button
            onClick={savePin}
            className="cursor-pointer rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            {saved ? "Saved" : "Save Pin Location"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
