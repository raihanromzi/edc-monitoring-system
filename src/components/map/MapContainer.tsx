"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { MerchantDto } from "@/lib/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-ink-secondary" role="status" aria-label="Loading map">
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
  const [saveError, setSaveError] = useState("");

  async function savePin() {
    if (!draftPin) return;
    setSaveError("");
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
    } else {
      setSaveError("Could not save pin. Try again.");
    }
  }

  function toggleAdjust() {
    setAdjustMode((v) => !v);
    setDraftPin(null);
    setSaveError("");
  }

  return (
    <div className="relative h-full w-full">
      <LeafletMap
        {...props}
        adjustMode={adjustMode}
        onDropPin={(id, lat, lng) => {
          setDraftPin({ id, lat, lng });
          setSaved(false);
        }}
      />

      <div className="absolute right-4 top-4 z-[1000] flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-slate-900/[0.08] bg-white/92 py-1 pl-4 pr-1.5 text-[12px] text-ink-secondary shadow-[0_12px_36px_-4px_rgba(15,23,42,0.09),0_2px_6px_rgba(15,23,42,0.04)] backdrop-blur-xl max-md:left-2 max-md:right-2 max-md:top-2 max-md:max-w-none">
        <span className="live-dot shrink-0" aria-hidden="true" />
        <span className="truncate">
          {adjustMode ? "Drag the pin to set its location" : "Click a pin to open its details"}
        </span>
        {props.selectedId ? (
          <button
            type="button"
            onClick={toggleAdjust}
            aria-pressed={adjustMode}
            className="btn-secondary h-[30px] rounded-full px-3 text-[12px]"
          >
            {adjustMode ? "Cancel" : "Adjust pin"}
          </button>
        ) : null}
        {draftPin ? (
          <button type="button" onClick={savePin} className="btn-primary h-[30px] rounded-full px-3 text-[12px]">
            {saved ? "Saved" : "Save pin"}
          </button>
        ) : null}
      </div>
      {saveError ? (
        <p role="alert" className="pill absolute right-4 top-[68px] z-[1000] border border-red-200 bg-red-50 text-red-700">{saveError}</p>
      ) : null}
    </div>
  );
}
