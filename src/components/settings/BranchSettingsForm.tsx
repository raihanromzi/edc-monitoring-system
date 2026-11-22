"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";

interface Config {
  id: string;
  branchName: string;
  branchCode: string;
  latitude: number;
  longitude: number;
  redVolumeThreshold: number;
  yellowDropPctThreshold: number;
  redInactivityDays: number;
}

export default function BranchSettingsForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    fetch("/api/branch-config").then((r) => r.json()).then(setConfig).catch(() => setConfig(null));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/branch-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branchName: config.branchName,
        latitude: config.latitude,
        longitude: config.longitude,
        redVolumeThreshold: config.redVolumeThreshold,
        yellowDropPctThreshold: config.yellowDropPctThreshold,
        redInactivityDays: config.redInactivityDays,
      }),
    });
    setSaving(false);
    setOk(res.ok);
    setMessage(res.ok ? "Thresholds saved. Merchant health recalculated." : "Save failed. Check the values and try again.");
  }

  if (!config) return <Card className="text-center text-[13px] text-ink-secondary">Loading configuration…</Card>;

  const fields: [keyof Config, string, string][] = [
    ["branchName", "Branch name", "text"],
    ["latitude", "Branch latitude", "number"],
    ["longitude", "Branch longitude", "number"],
    ["redVolumeThreshold", "Red volume threshold (IDR/month)", "number"],
    ["yellowDropPctThreshold", "Yellow drop threshold (0–1)", "number"],
    ["redInactivityDays", "Red inactivity days", "number"],
  ];

  return (
    <Card className="space-y-4">
      <h2 className="text-[13px] font-semibold text-ink">Branch thresholds</h2>
      <form onSubmit={save} className="space-y-4">
        {fields.map(([key, label, type]) => (
          <label key={key} className="block space-y-1.5 text-[12px] font-medium text-ink-secondary">
            {label}
            <Input
              type={type}
              step="any"
              required
              value={config[key] as string | number}
              onChange={(e) => setConfig({ ...config, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
            />
          </label>
        ))}
        {message ? <p role="status" className={`text-[12px] ${ok ? "text-emerald-700" : "text-red-700"}`}>{message}</p> : null}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save configuration"}</Button>
      </form>
    </Card>
  );
}
