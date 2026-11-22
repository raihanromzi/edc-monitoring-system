"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Card } from "@/components/ui";

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
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/merchants/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    setUploading(false);
    setResult(json);
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-ink">EDA CSV ingestion</h2>
        <a
          href="/templates/sample_eda_merchants.csv"
          download
          className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-cobalt hover:underline"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download template
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
        className={`cursor-pointer rounded-panel border-2 border-dashed p-8 text-center text-[13px] transition-colors duration-150 ${dragOver ? "border-cobalt bg-blue-50/60 text-ink" : "border-control bg-subtle/60 text-ink-secondary hover:border-slate-300"}`}
      >
        <Upload className="mx-auto mb-2 h-6 w-6 text-ink-muted" aria-hidden="true" />
        Drag and drop a CSV here, or click to browse
        {fileName ? <p className="num mt-1 text-[11px] text-ink-muted">{fileName}</p> : null}
      </div>
      <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      {uploading ? <p role="status" className="text-[12px] text-ink-secondary">Uploading and validating rows…</p> : null}
      {result ? (
        result.error ? (
          <div className="space-y-2 rounded-control border border-red-200 bg-red-50 p-3" role="alert">
            <p className="text-[13px] font-semibold text-red-700">{result.error}</p>
            {result.errors?.length ? (
              <table className="w-full text-[12px] text-red-800">
                <thead><tr className="text-left text-red-600"><th className="pr-2 font-semibold">Row</th><th className="font-semibold">Errors</th></tr></thead>
                <tbody>
                  {result.errors.slice(0, 20).map((e) => (
                    <tr key={e.row}><td className="num pr-2 align-top">{e.row}</td><td>{e.errors.join("; ")}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        ) : (
          <div className="rounded-control border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-emerald-800" role="status">
            Processed <span className="num">{result.totalProcessed}</span> rows: <span className="num">{result.inserted}</span> inserted, <span className="num">{result.updated}</span> updated. Health: <span className="num">{result.redCount}</span> red, <span className="num">{result.yellowCount}</span> yellow, <span className="num">{result.greenCount}</span> green.
          </div>
        )
      ) : null}
    </Card>
  );
}
