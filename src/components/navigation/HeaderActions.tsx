"use client";

import { useState } from "react";
import { Database, LoaderCircle } from "lucide-react";

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
    <>
      <button
        type="button"
        className="btn-icon disabled:cursor-wait disabled:opacity-60"
        onClick={loadDemo}
        disabled={loading}
        aria-label={loading ? "Loading sample data" : "Load sample data"}
        title="Load sample data"
      >
        {loading ? (
          <LoaderCircle className="h-[17px] w-[17px] animate-spin" aria-hidden="true" />
        ) : (
          <Database className="h-[17px] w-[17px]" aria-hidden="true" />
        )}
      </button>
      {message ? <span role="status" className="sr-only">{message}</span> : null}
    </>
  );
}
