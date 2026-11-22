"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair, Minus, Plus } from "lucide-react";
import { branchIconHtml, pinIconHtml } from "./MapMarkers";
import type { MerchantDto } from "@/lib/types";

const SIDEBAR_OFFSET_PX = 412; // left edge of the detail popover on desktop (sidebar 380px + 16px gutter + 16px gap)
const POPOVER_WIDTH_PX = 340;

function makeIcon(status: MerchantDto["healthStatus"], selected: boolean, pulse: boolean) {
  return L.divIcon({
    html: pinIconHtml(status, selected, pulse),
    className: "map-marker-wrap",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

const BRANCH_ICON = L.divIcon({
  html: branchIconHtml(),
  className: "map-marker-wrap",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function FlyTo({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    const zoom = Math.max(map.getZoom(), 16);
    let center = L.latLng(target.lat, target.lng);
    // On desktop, the sidebar and detail popover cover the left part of the map. Shift the view so the
    // marker lands in the middle of the uncovered area to its right.
    if (window.matchMedia("(min-width: 768px)").matches) {
      const width = map.getSize().x;
      const coveredRight = SIDEBAR_OFFSET_PX + POPOVER_WIDTH_PX + 16;
      const shift = Math.max(0, (coveredRight + width) / 2 - width / 2);
      center = map.unproject(map.project(center, zoom).subtract([shift, 0]), zoom);
    }
    map.flyTo(center, zoom, { duration: 0.5 });
  }, [target, map]);
  return null;
}

/** Floating map controls rendered into the Leaflet container (replaces zoomControl). */
function MapControls({ branch }: { branch: { latitude: number; longitude: number } }) {
  const map = useMap();
  const [center, setCenter] = useState(() => map.getCenter());

  useEffect(() => {
    const update = () => setCenter(map.getCenter());
    map.on("moveend", update);
    return () => {
      map.off("moveend", update);
    };
  }, [map]);

  return createPortal(
    <div className="absolute bottom-[52px] right-4 z-[1000] flex flex-col items-end gap-1.5 max-md:bottom-[42dvh]">
      <button
        type="button"
        className="btn-icon"
        aria-label="Recenter to branch"
        title="Recenter to branch"
        onClick={() => map.flyTo([branch.latitude, branch.longitude], 14, { duration: 0.5 })}
      >
        <Crosshair className="h-[17px] w-[17px]" aria-hidden="true" />
      </button>
      <button type="button" className="btn-icon" aria-label="Zoom in" title="Zoom in" onClick={() => map.zoomIn()}>
        <Plus className="h-[17px] w-[17px]" aria-hidden="true" />
      </button>
      <button type="button" className="btn-icon" aria-label="Zoom out" title="Zoom out" onClick={() => map.zoomOut()}>
        <Minus className="h-[17px] w-[17px]" aria-hidden="true" />
      </button>
      <div className="num mt-0.5 flex h-[34px] items-center rounded-control border border-slate-900/[0.08] bg-white/95 px-3 text-[11.5px] font-medium text-ink-secondary shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
        {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
      </div>
    </div>,
    map.getContainer(),
  );
}

interface Props {
  merchants: MerchantDto[];
  branch: { latitude: number; longitude: number };
  selectedId: string | null;
  onSelect: (id: string) => void;
  adjustMode: boolean;
  onDropPin: (id: string, lat: number, lng: number) => void;
}

export default function LeafletMap({ merchants, branch, selectedId, onSelect, adjustMode, onDropPin }: Props) {
  const icons = useMemo(
    () => Object.fromEntries(merchants.map((m) => [m.id, makeIcon(m.healthStatus, m.id === selectedId, m.id === selectedId)])),
    [merchants, selectedId],
  );

  const clickable = adjustMode ? [] : merchants;
  const draggable = adjustMode ? merchants.filter((m) => m.id === selectedId) : [];
  const selectedMerchant = merchants.find((m) => m.id === selectedId);
  const flyTarget = selectedMerchant && selectedMerchant.latitude !== null && selectedMerchant.longitude !== null
    ? { lat: selectedMerchant.latitude, lng: selectedMerchant.longitude }
    : null;

  return (
    <MapContainer
      center={[branch.latitude, branch.longitude]}
      zoom={14}
      scrollWheelZoom
      zoomControl={false}
      attributionControl
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[branch.latitude, branch.longitude]} icon={BRANCH_ICON} keyboard={false}>
        <Tooltip direction="top" offset={[0, -10]}>Branch</Tooltip>
      </Marker>
      {clickable.map((m) =>
        m.latitude === null || m.longitude === null ? null : (
          <Marker
            key={m.id}
            position={[m.latitude, m.longitude]}
            icon={icons[m.id]}
            eventHandlers={{ click: () => onSelect(m.id) }}
            alt={m.merchantName}
          >
            <Tooltip direction="top" offset={[0, -12]}>{m.merchantName}</Tooltip>
          </Marker>
        ),
      )}
      {draggable.map((m) =>
        m.latitude === null || m.longitude === null ? null : (
          <Marker
            key={`adj-${m.id}`}
            position={[m.latitude, m.longitude]}
            icon={makeIcon(m.healthStatus, true, true)}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const ll = (e.target as L.Marker).getLatLng();
                onDropPin(m.id, ll.lat, ll.lng);
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -12]} permanent>Drag to adjust</Tooltip>
          </Marker>
        ),
      )}
      <FlyTo target={flyTarget} />
      <MapControls branch={branch} />
    </MapContainer>
  );
}
