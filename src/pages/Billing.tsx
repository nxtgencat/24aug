import { useState, useMemo, useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { mockInvoices, mockPatients } from '../services/mockData';
import { NotificationContext } from '../context/NotificationContext';
import type { Invoice } from '../types';
import { exportInvoicePDF, exportExcel } from '../services/exporters';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { paginate, formatDate, formatCurrency } from '../utils/helpers';

const schema = yup.object({
  patient: yup.string().required('Select a patient'),
  items: yup.array().of(yup.object({
    label: yup.string().min(2,'Label required').required(),
    amount: yup.number().typeError('Amount must be a number').min(1,'Min ₹1').required(),
  })).min(1,'Add at least one line item').required(),
});
type FormValues = yup.InferType<typeof schema>;

const statusVariant=(s:Invoice['status'])=> s==='Paid'?'success':s==='Pending'?'warning':'danger';

export default function Billing(){
  const { push } = useContext(NotificationContext);
  const [list,setList]=useState<Invoice[]>(mockInvoices);
  const [q,setQ]=useState(''); const [status,setStatus]=useState('All'); const [page,setPage]=useState(1);
  const [selected,setSelected]=useState<Invoice|null>(null);
  const [showAdd,setShowAdd]=useState(false);
  const perPage=6;

  const { register, handleSubmit, control, reset, watch, formState:{errors} } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues:{ patient:'', items:[{label:'Consultation', amount:800}] },
  });
  const { fields, append, remove } = useFieldArray({ control, name:'items' });
  const watched = watch('items');
  const liveTotal = (watched ?? []).reduce((s,i)=>s+Number(i?.amount||0),0);

  const stats = useMemo(()=>{
    const paid=list.filter(i=>i.status==='Paid');
    const due=list.filter(i=>i.status!=='Paid');
    const sum=(arr:Invoice[])=>arr.reduce((s,i)=>s+i.items.reduce((a,x)=>a+x.amount,0),0);
    return { collected:sum(paid), pending:sum(due), count:list.length };
  },[list]);

  const filtered = useMemo(()=>{
    let arr=[...list];
    if(q) arr=arr.filter(i=>`${i.patient} ${i.id}`.toLowerCase().includes(q.toLowerCase()));
    if(status!=='All') arr=arr.filter(i=>i.status===status);
    return arr.sort((a,b)=>b.date.localeCompare(a.date));
  },[list,q,status]);

  const totalPages=Math.max(1,Math.ceil(filtered.length/perPage));
  const pageData=paginate(filtered,page,perPage);

  const onSubmit=(data:FormValues)=>{
    const inv:Invoice={ id:`INV-${9000+list.length+1}`, date:dayjs().format('YYYY-MM-DD'), status:'Pending', ...data };
    setList(prev=>[inv,...prev]);
    setShowAdd(false); reset(); setPage(1);
    toast.success(`Invoice ${inv.id} created`);
    push({ title:'Invoice Created', message:`${inv.id} · ${formatCurrency(liveTotal)} — ${data.patient}`, type:'billing' });
  };

  const markPaid=(id:string)=>{
    const inv=list.find(i=>i.id===id);
    setList(prev=>prev.map(i=>i.id===id?{...i,status:'Paid'}:i));
    setSelected(prev=>prev && prev.id===id ? {...prev,status:'Paid'} : prev);
    toast.success(`${id} marked Paid`);
    if(inv) push({ title:'Payment Received', message:`${inv.id} paid by ${inv.patient}`, type:'billing' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <span className="ticket-tag">BILLING · INVOICES + EXPORT</span>
          <h1 className="font-display text-2xl font-semibold mt-2">Billing</h1>
        </div>
        <Button onClick={()=>setShowAdd(true)}>+ New Invoice</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card py-4"><p className="mini-tag">COLLECTED</p><p className="font-display text-2xl font-semibold mt-1 text-mint">{formatCurrency(stats.collected)}</p></div>
        <div className="card py-4"><p className="mini-tag">PENDING DUES</p><p className="font-display text-2xl font-semibold mt-1 text-amber">{formatCurrency(stats.pending)}</p></div>
        <div className="card py-4"><p className="mini-tag">INVOICES</p><p className="font-display text-2xl font-semibold mt-1">{stats.count}</p></div>
      </div>

      <div className="card flex flex-wrap gap-3 items-center">
        <SearchBar value={q} onChange={v=>{setQ(v); setPage(1);}} placeholder="Search patient or invoice ID"/>
        <select className="field w-auto" value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}}>
          <option>All</option><option>Paid</option><option>Pending</option><option>Overdue</option>
        </select>
        <span className="mini-tag ml-auto">{filtered.length} invoices</span>
      </div>

      {pageData.length===0 ? <EmptyState title="No invoices found" desc="Create an invoice or clear filters."/> : (
        <div className="grid gap-3">
          {pageData.map(inv=>{
            const total=inv.items.reduce((s,i)=>s+i.amount,0);
            return (
              <div key={inv.id} className="card flex flex-wrap gap-4 items-center justify-between py-4">
                <div>
                  <p className="font-medium text-sm">{inv.patient} <span className="font-mono text-xs text-slate">{inv.id}</span></p>
                  <p className="text-xs text-slate mt-0.5">{formatDate(inv.date)} · {inv.items.length} line item{inv.items.length>1?'s':''}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display font-semibold">{formatCurrency(total)}</span>
                  <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
                  <button className="btn-outline py-1.5 text-xs" onClick={()=>setSelected(inv)}>View</button>
                  {inv.status!=='Paid' && <button className="btn-primary py-1.5 text-xs" onClick={()=>markPaid(inv.id)}>Mark Paid</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage}/>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Invoice ${selected?.id ?? ''}`}>
        {selected && (()=>{ const total=selected.items.reduce((s,i)=>s+i.amount,0); return (
          <div className="space-y-3 text-sm">
            <p><span className="mini-tag mr-2">PATIENT</span>{selected.patient}</p>
            <p><span className="mini-tag mr-2">DATE</span>{formatDate(selected.date)} · <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge></p>
            <div className="rounded-lg border border-line dark:border-linedark px-4 py-3 space-y-2">
              {selected.items.map((it,i)=>(
                <div key={i} className="flex justify-between"><span>{it.label}</span><span>{formatCurrency(it.amount)}</span></div>
              ))}
              <div className="flex justify-between font-semibold border-t border-line dark:border-linedark pt-2"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={()=>{exportExcel(`${selected.id}-lines`,'Invoice',selected.items.map(i=>({Description:i.label,'Amount INR':i.amount}))); toast.success(`${selected.id} exported to Excel`);}}>Export Excel</Button>
              <Button onClick={()=>{exportInvoicePDF(selected); toast.success(`${selected.id}.pdf downloaded`);}}>Export PDF</Button>
            </div>
          </div>
        );})()}
      </Modal>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="New Invoice">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="mini-tag mb-1 block">Patient</label>
            <select className="field" {...register('patient')}>
              <option value="">Select patient…</option>
              {mockPatients.slice(0,14).map(p=><option key={p.id} value={p.name}>{p.name} ({p.id})</option>)}
            </select>
            {errors.patient && <p className="text-rose text-xs mt-1">{errors.patient.message}</p>}
          </div>
          <p className="mini-tag pt-1">LINE ITEMS</p>
          {typeof errors.items?.message==='string' && <p className="text-rose text-xs">{errors.items.message}</p>}
          <div className="space-y-2 max-h-56 overflow-auto pr-1">
            {fields.map((f,i)=>(
              <div key={f.id} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-[2fr_1fr] gap-2">
                  <Input placeholder="Description" {...register(`items.${i}.label` as const)} error={errors.items?.[i]?.label?.message}/>
                  <Input placeholder="₹" type="number" {...register(`items.${i}.amount` as const)} error={errors.items?.[i]?.amount?.message}/>
                </div>
                {fields.length>1 && <button type="button" className="btn-icon mt-1" onClick={()=>remove(i)}>✕</button>}
              </div>
            ))}
          </div>
          <button type="button" className="btn-outline w-full" onClick={()=>append({label:'',amount:100})}>+ Add Line Item</button>
          <div className="flex justify-between items-center bg-paper dark:bg-inkdark rounded-lg px-4 py-3">
            <span className="mini-tag">TOTAL</span>
            <span className="font-display font-semibold text-lg">{formatCurrency(liveTotal)}</span>
          </div>
          <Button type="submit" className="w-full">Create Invoice</Button>
        </form>
      </Modal>
    </div>
  );
}
