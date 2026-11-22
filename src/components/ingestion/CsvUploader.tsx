"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { parseMerchantCsv } from "@/lib/csv";

interface IngestResult {
  success?: boolean;
  totalProcessed?: number;
  inserted?: number;
  updated?: number;
  redCount?: number;
  yellowCount?: number;
  greenCount?: number;
  error?: string;
  errors?: { row: number; errors: string[] }[];
}

export default function CsvUploader() {
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<IngestResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setFileName(file.name);
    setUploading(true);
    setResult(null);
    const res = await fetch("/api/merchants/upload", { method: "POST", body: (() => { const fd = new FormData(); fd.append("file", file); return fd; })() });
    const json = await res.json().catch(() => ({}));
    setUploading(false);
    setResult(json);
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">EDA CSV Ingestion</h2>
        <a href="/templates/sample_eda_merchants.csv" download className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-green-400 hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
          <Download className="h-3 w-3" aria-hidden="true" /> Download Template
        </a>
      </div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload CSV file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) upload(f); }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${dragOver ? "border-green-500 bg-green-500/5" : "border-slate-700 text-slate-400"}`}
      >
        <Upload className="mx-auto mb-2 h-6 w-6" aria-hidden="true" />
        Drag & drop CSV here, or click to browse
        {fileName ? <p className="mt-1 text-xs text-slate-500">{fileName}</p> : null}
      </div>
      <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      {uploading ? <p role="status" className="text-xs text-slate-400">Uploading and validating rows…</p> : null}
      {result ? (
        result.error ? (
          <div className="space-y-2 rounded-lg bg-red-500/10 p-3" role="alert">
            <p className="text-sm font-semibold text-red-300">{result.error}</p>
            {result.errors?.length ? (
              <table className="w-full text-xs text-red-200">
                <thead><tr className="text-left text-red-400"><th className="pr-2">Row</th><th>Errors</th></tr></thead>
                <tbody>
                  {result.errors.slice(0, 20).map((e) => (
                    <tr key={e.row}><td className="pr-2 align-top">{e.row}</td><td>{e.errors.join("; ")}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        ) : (
          <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-300" role="status">
            Processed {result.totalProcessed} rows — {result.inserted} inserted, {result.updated} updated. Health: {result.redCount} red, {result.yellowCount} yellow, {result.greenCount} green.
          </div>
        )
      ) : null}
    </Card>
  );
}
