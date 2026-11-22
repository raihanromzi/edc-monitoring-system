const CAUSE_LABELS: Record<string, string> = {
  PAPER_OUT: "Thermal paper out",
  SIM_SIGNAL_DEAD: "SIM / signal dead",
  CASHIER_UNTRAINED: "Cashier untrained",
  COMPETITOR_PROMO: "Competitor terminal preferred",
  STORE_CLOSED: "Store closed / relocated",
  OTHER: "Other",
};

export default function VisitHistory({ visits }: { visits: { id: string; visitDate: string; visitorName: string; rootCause: string; actionTaken: string; notes: string | null }[] }) {
  if (!visits.length) return <p className="py-6 text-center text-[12px] text-ink-secondary">No visits logged yet.</p>;
  return (
    <ol className="max-h-56 space-y-3 overflow-y-auto border-l border-slate-900/10 pl-4">
      {visits.map((visit) => (
        <li key={visit.id} className="relative text-[12px] text-ink-secondary before:absolute before:-left-[21px] before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-emerald-500">
          <p className="font-semibold text-ink">{CAUSE_LABELS[visit.rootCause] ?? visit.rootCause}</p>
          <p className="num text-[11px] text-ink-muted">{new Date(visit.visitDate).toLocaleString("id-ID")} · {visit.visitorName}</p>
          <p className="mt-1 leading-snug">{visit.actionTaken}</p>
          {visit.notes ? <p className="mt-1 text-ink-muted">{visit.notes}</p> : null}
        </li>
      ))}
    </ol>
  );
}
