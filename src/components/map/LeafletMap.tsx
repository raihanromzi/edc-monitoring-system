"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { pinIconHtml } from "./MapMarkers";
import type { MerchantDto } from "@/lib/types";

function makeIcon(status: MerchantDto["healthStatus"], pulse: boolean) {
  return L.divIcon({
    html: pinIconHtml(status, pulse),
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 28],
  });
}

function FlyTo({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 16, { duration: 0.5 });
  }, [target, map]);
  return null;
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
    () => Object.fromEntries(
      merchants.map((m) => [m.id, makeIcon(m.healthStatus, m.id === selectedId)]),
    ),
    [merchants, selectedId],
  );

  const clickable = adjustMode ? [] : merchants;
  const draggable = adjustMode ? merchants.filter((m) => m.id === selectedId) : [];

  return (
    <MapContainer
      center={[branch.latitude, branch.longitude]}
      zoom={14}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#1A1E2F" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[branch.latitude, branch.longitude]}
        icon={L.divIcon({ html: '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="11" fill="#F8FAFC" stroke="#020617" stroke-width="1.5"/><path d="M12 3 4 9h16z" fill="#F8FAFC" stroke="#020617" stroke-width="1.5"/></svg>', className: "", iconSize: [24, 24], iconAnchor: [12, 20] })}
      >
        <Popup>Branch anchor</Popup>
      </Marker>
      {clickable.map((m) =>
        m.latitude === null || m.longitude === null ? null : (
          <Marker
            key={m.id}
            position={[m.latitude, m.longitude]}
            icon={icons[m.id]}
            eventHandlers={{ click: () => onSelect(m.id) }}
          >
            <Popup>{m.merchantName}</Popup>
          </Marker>
        ),
      )}
      {draggable.map((m) =>
        m.latitude === null || m.longitude === null ? null : (
          <Marker
            key={`adj-${m.id}`}
            position={[m.latitude, m.longitude]}
            icon={makeIcon(m.healthStatus, true)}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const ll = (e.target as L.Marker).getLatLng();
                onDropPin(m.id, ll.lat, ll.lng);
              },
            }}
          >
            <Popup>Drag to adjust, then Save Pin</Popup>
          </Marker>
        ),
      )}
      <FlyTo target={selectedId ? (() => { const m = merchants.find((x) => x.id === selectedId); return m && m.latitude !== null && m.longitude !== null ? { lat: m.latitude, lng: m.longitude } : null; })() : null} />
    </MapContainer>
  );
}
