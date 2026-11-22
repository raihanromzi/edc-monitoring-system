import CsvUploader from "@/components/ingestion/CsvUploader";
import BranchSettingsForm from "@/components/settings/BranchSettingsForm";

export const metadata = { title: "Settings · EDC Monitoring" };

export default function SettingsPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CsvUploader />
      <BranchSettingsForm />
    </div>
  );
}
