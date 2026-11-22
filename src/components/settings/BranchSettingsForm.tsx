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
    setMessage(res.ok ? "Thresholds saved. Merchant health recalculated." : "Save failed.");
  }

  if (!config) return <Card className="text-center text-sm text-slate-400">Loading configuration…</Card>;

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
      <h2 className="text-sm font-semibold text-slate-100">Branch Thresholds</h2>
      <form onSubmit={save} className="space-y-4">
        {fields.map(([key, label, type]) => (
          <label key={key} className="block space-y-1 text-sm text-slate-200">
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
        {message ? <p role="status" className={message.startsWith("Thresh") ? "text-xs text-green-400" : "text-xs text-red-400"}>{message}</p> : null}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Configuration"}</Button>
      </form>
    </Card>
  );
}
