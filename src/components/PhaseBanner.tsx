export default function PhaseBanner({phase}:{phase:1|2|3}){
  const map={1:{label:'Phase 1 — Foundation & Shell', desc:'Auth · Dashboard · Patients · Doctors · RBAC visuals'},2:{label:'Phase 2 — Clinical Workflows', desc:'Appointments · Records · Prescriptions · Lab · Pharmacy · Billing'},3:{label:'Phase 3 — Production Ready', desc:'Reports · Map · Performance & Error Hardening'}};
  const cur=map[phase];
  return (
    <div className="bg-ink dark:bg-paperdark text-paper dark:text-inkdark px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="ticket-tag !text-paper/80 dark:!text-inkdark/60 !border-paper/20">DEMO</span>
        <span className="font-display font-semibold text-sm">{cur.label}</span>
        <span className="hidden sm:block text-xs opacity-70">{cur.desc}</span>
      </div>
      <span className="font-mono text-[10px] tracking-widest opacity-60">HMS v0.{phase}.0 — show to team</span>
    </div>
  );
}
