import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CsvUploader from "@/components/ingestion/CsvUploader";
import BranchSettingsForm from "@/components/settings/BranchSettingsForm";

export const metadata = { title: "Settings · EDC Monitoring" };

export default function SettingsPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-10 pt-20 md:px-8">
        <Link href="/" className="pill glass-panel fixed left-4 top-4 z-30 cursor-pointer rounded-full px-4 py-2 text-[12px] font-medium text-ink hover:bg-white">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to map
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-[-0.01em] text-ink">Settings</h1>
          <p className="mt-1 text-[13px] text-ink-secondary">Import merchant data and tune branch health thresholds.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <CsvUploader />
          <BranchSettingsForm />
        </div>
      </div>
    </div>
  );
}
