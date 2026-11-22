"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/ui";

const CAUSES = [
  ["PAPER_OUT", "Thermal paper out"],
  ["SIM_SIGNAL_DEAD", "SIM / signal dead"],
  ["CASHIER_UNTRAINED", "Cashier untrained"],
  ["COMPETITOR_PROMO", "Competitor terminal preferred"],
  ["STORE_CLOSED", "Store closed / relocated"],
  ["OTHER", "Other"],
] as const;

export default function VisitModal({ open, merchantId, merchantName, onClose, onSaved }: { open: boolean; merchantId: string; merchantName: string; onClose: () => void; onSaved: () => void }) {
  const [visitorName, setVisitorName] = useState("");
  const [rootCause, setRootCause] = useState<(typeof CAUSES)[number][0]>("PAPER_OUT");
  const [actionTaken, setActionTaken] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantId, visitorName, rootCause, actionTaken, notes: notes || undefined }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save visit. Check required fields.");
      return;
    }
    onSaved();
  }

  return (
    <Modal open={open} title={`Log visit · ${merchantName}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error ? <p role="alert" className="rounded-lg bg-red-500/15 p-3 text-sm text-red-300">{error}</p> : null}
        <label className="block space-y-1 text-sm text-slate-200">Officer name<Input required value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Your name" /></label>
        <fieldset className="space-y-2">
          <legend className="text-sm text-slate-200">Primary root cause</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {CAUSES.map(([value, label]) => (
              <label key={value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 p-2 text-xs text-slate-300 has-[:checked]:border-green-500 has-[:checked]:bg-green-500/10">
                <input type="radio" name="rootCause" value={value} checked={rootCause === value} onChange={() => setRootCause(value)} /> {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block space-y-1 text-sm text-slate-200">Action taken<textarea required minLength={3} value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="What was done?" /></label>
        <label className="block space-y-1 text-sm text-slate-200">Notes <span className="text-slate-500">(optional)</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-16 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Additional context" /></label>
        <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save & Mark Done"}</Button></div>
      </form>
    </Modal>
  );
}
