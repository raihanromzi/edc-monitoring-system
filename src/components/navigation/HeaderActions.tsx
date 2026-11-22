"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function HeaderActions() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDemo() {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/seed", { method: "POST" });
    setLoading(false);
    if (res.ok) {
      setMessage("Sample data loaded.");
      window.location.reload();
    } else {
      setMessage("Failed to seed data. Check DATABASE_URL.");
    }
  }

  return (
    <div className="flex items-center gap-2">
      {message ? <span role="status" className="text-xs text-slate-400">{message}</span> : null}
      <Button variant="secondary" onClick={loadDemo} disabled={loading}>
        {loading ? "Loading…" : "Load Demo"}
      </Button>
    </div>
  );
}
