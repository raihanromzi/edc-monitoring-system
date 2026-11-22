"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/ui";

const CAUSES = [
  ["PAPER_OUT", "Thermal paper out"],
  ["SIM_SIGNAL_DEAD", "SIM / signal dead"],
  ["CASHIER_UNTRAINED", "Cashier untrained"],
  ["COMPETITOR_PROMO", "Competitor terminal preferred"],
  ["STORE_CLOSED", "Store closed / relocated"],
  ["OTHER", "Other"],
] as const;

const LABEL = "block space-y-1.5 text-[12px] font-medium text-ink-secondary";

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
      setError(data.error ?? "Could not save visit. Check the required fields.");
      return;
    }
    onSaved();
  }

  return (
    <Modal open={open} title={`Log visit · ${merchantName}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error ? <p role="alert" className="rounded-control border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</p> : null}
        <label className={LABEL}>
          Officer name
          <input className="field" required value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Your name" />
        </label>
        <fieldset className="space-y-2">
          <legend className="mb-2 text-[12px] font-medium text-ink-secondary">Primary root cause</legend>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {CAUSES.map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-control border border-control bg-white px-3 py-2 text-[12px] text-ink-secondary transition-colors duration-150 hover:border-slate-300 has-[:checked]:border-cobalt has-[:checked]:bg-blue-50 has-[:checked]:text-ink"
              >
                <input type="radio" name="rootCause" value={value} checked={rootCause === value} onChange={() => setRootCause(value)} className="accent-[#2563EB]" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className={LABEL}>
          Action taken
          <textarea className="field" required minLength={3} value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} placeholder="What was done?" />
        </label>
        <label className={LABEL}>
          Notes <span className="font-normal text-ink-muted">(optional)</span>
          <textarea className="field" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional context" />
        </label>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save & mark done"}</Button>
        </div>
      </form>
    </Modal>
  );
}
