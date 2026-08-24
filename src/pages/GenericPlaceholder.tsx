import { mockAppointments, mockMedicines } from '../services/mockData';
import Badge from '../components/ui/Badge';
import FileUpload from '../components/ui/FileUpload';

export default function GenericPlaceholder({title, note}:{title:string; note?:string}){
  return (
    <div className="space-y-4">
      <div>
        <span className="ticket-tag">{title.toUpperCase()} · PHASE {title==='Appointments'||title==='Pharmacy'?'2':'1-2'}</span>
        <h1 className="font-display text-2xl font-semibold mt-2">{title}</h1>
        <p className="text-slate text-sm mt-1">{note || "Visual placeholder — full CRUD wired in Phase 2. Tearline card & table primitives shown."}</p>
      </div>
      {title==='Appointments' && <div className="grid gap-3">
        {mockAppointments.slice(0,6).map(a=><div key={a.id} className="card flex justify-between items-center"><div><p className="font-medium text-sm">{a.patient} → {a.doctor}</p><p className="text-xs text-slate">{a.date} {a.time} · {a.type}</p></div><Badge variant={a.status==='Upcoming'?'warning':a.status==='Completed'?'success':'danger'}>{a.status}</Badge></div>)}
        <div className="card"><p className="mini-tag mb-2">BOOK APPOINTMENT (PREVIEW)</p><div className="grid sm:grid-cols-3 gap-2"><select className="field"><option>Select Doctor</option></select><input className="field" type="date"/><select className="field"><option>9:00 AM</option></select></div><button className="btn-primary mt-3">Confirm Booking</button></div>
      </div>}
      {title==='Pharmacy' && <div className="grid gap-3">
        {mockMedicines.map(m=><div key={m.id} className="card flex justify-between items-center"><div><p className="font-medium text-sm">{m.name}</p><p className="text-xs text-slate">{m.category} · Supplier: {m.supplier}</p></div><div className="text-right"><p className="text-sm">₹{m.price}</p>{m.stock<5 ? <Badge variant="danger">Low Stock: {m.stock}</Badge> : <Badge variant="success">Stock: {m.stock}</Badge>}</div></div>)}
      </div>}
      {title==='Laboratory' && <div className="space-y-3"><FileUpload label="Upload Lab Report (PDF/Image)"/><div className="card"><p className="mini-tag">RECENT REPORTS</p><p className="text-sm mt-2">Report #R-101 · Blood Test · <span className="text-mint">Ready</span> · <a className="text-cobalt underline">Preview & Download</a></p></div></div>}
      {title==='Billing' && <div className="card"><p className="mini-tag">INVOICE PREVIEW</p><div className="mt-3 text-sm space-y-1"><div className="flex justify-between"><span>Consultation</span><span>₹1200</span></div><div className="flex justify-between"><span>Lab Charges</span><span>₹800</span></div><div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>₹2000</span></div></div><div className="mt-4 flex gap-2"><button className="btn-primary">Export PDF</button><button className="btn-outline">Export Excel</button></div></div>}
      {['Records','Prescriptions','Reports'].includes(title) && <div className="card"><p className="text-sm">This module uses Tearline <code className="font-mono text-xs bg-paper dark:bg-inkdark px-1 py-0.5 rounded">.card</code> + <code className="font-mono text-xs bg-paper dark:bg-inkdark px-1 py-0.5 rounded">.field</code> + table primitives. Full functionality lands in Phase 2/3 with Demo GIF.</p><div className="mt-3 h-24 skeleton rounded-lg animate-shimmer"/></div>}
    </div>
  );
}
