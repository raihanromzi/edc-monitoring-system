const CAUSE_LABELS: Record<string, string> = {
  PAPER_OUT: "Thermal paper out",
  SIM_SIGNAL_DEAD: "SIM / signal dead",
  CASHIER_UNTRAINED: "Cashier untrained",
  COMPETITOR_PROMO: "Competitor terminal preferred",
  STORE_CLOSED: "Store closed / relocated",
  OTHER: "Other",
};

export default function VisitHistory({ visits }: { visits: { id: string; visitDate: string; visitorName: string; rootCause: string; actionTaken: string; notes: string | null }[] }) {
  if (!visits.length) return <p className="py-4 text-center text-xs text-slate-500">No visits logged.</p>;
  return (
    <ol className="space-y-3 border-l border-slate-700 pl-4">
      {visits.map((visit) => (
        <li key={visit.id} className="relative text-xs text-slate-300 before:absolute before:-left-[21px] before:top-1 before:h-2 before:w-2 before:rounded-full before:bg-green-500">
          <p className="font-semibold text-slate-100">{CAUSE_LABELS[visit.rootCause] ?? visit.rootCause}</p>
          <p className="text-slate-500">{new Date(visit.visitDate).toLocaleString("id-ID")} · {visit.visitorName}</p>
          <p className="mt-1">{visit.actionTaken}</p>
          {visit.notes ? <p className="mt-1 text-slate-400">{visit.notes}</p> : null}
        </li>
      ))}
    </ol>
  );
}
