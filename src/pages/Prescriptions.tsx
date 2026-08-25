import { useState, useMemo, useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { mockPrescriptions, mockDoctors, mockPatients, mockMedicines } from '../services/mockData';
import { NotificationContext } from '../context/NotificationContext';
import type { Prescription } from '../types';
import { exportPrescriptionPDF } from '../services/exporters';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { formatDate } from '../utils/helpers';

const itemSchema = yup.object({
  medicine: yup.string().min(2,'Medicine required').required(),
  dose: yup.string().required('Dose required'),
  frequency: yup.string().required('Frequency required'),
  duration: yup.string().required('Duration required'),
});
const schema = yup.object({
  patient: yup.string().required('Select a patient'),
  doctor: yup.string().required('Select a doctor'),
  items: yup.array().of(itemSchema).min(1,'Add at least one medicine').required(),
  notes: yup.string(),
});
type FormValues = yup.InferType<typeof schema>;

export default function Prescriptions(){
  const { push } = useContext(NotificationContext);
  const [list,setList]=useState<Prescription[]>(mockPrescriptions);
  const [q,setQ]=useState('');
  const [selected,setSelected]=useState<Prescription|null>(null);
  const [showAdd,setShowAdd]=useState(false);

  const { register, handleSubmit, control, reset, formState:{errors} } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues:{ patient:'', doctor:'', items:[{medicine:'',dose:'1 tablet',frequency:'Twice daily',duration:'5 days'}], notes:'' },
  });
  const { fields, append, remove } = useFieldArray({ control, name:'items' });

  const filtered = useMemo(()=>{
    let arr=[...list];
    if(q) arr=arr.filter(r=>`${r.patient} ${r.doctor} ${r.id}`.toLowerCase().includes(q.toLowerCase()));
    return arr.sort((a,b)=>b.date.localeCompare(a.date));
  },[list,q]);

  const onSubmit=(data:FormValues)=>{
    const rx:Prescription={ id:`RX-${500+list.length+1}`, date: dayjs().format('YYYY-MM-DD'), ...data };
    setList(prev=>[rx,...prev]);
    setShowAdd(false); reset();
    toast.success(`Prescription ${rx.id} created`);
    push({ title:'Prescription Issued', message:`${rx.id} · ${rx.items.length} medicine(s) for ${data.patient}`, type:'prescription' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <span className="ticket-tag">PRESCRIPTIONS · PDF EXPORT</span>
          <h1 className="font-display text-2xl font-semibold mt-2">Prescriptions <span className="text-slate font-normal text-lg">({filtered.length})</span></h1>
        </div>
        <Button onClick={()=>setShowAdd(true)}>+ New Prescription</Button>
      </div>

      <div className="card">
        <SearchBar value={q} onChange={setQ} placeholder="Search patient, doctor or Rx ID"/>
      </div>

      {filtered.length===0 ? <EmptyState title="No prescriptions found" desc="Create one with the button above."/> : (
        <div className="grid gap-3">
          {filtered.map(rx=>(
            <div key={rx.id} className="card py-4">
              <div className="flex flex-wrap justify-between gap-3 items-start">
                <div>
                  <p className="font-medium text-sm">{rx.patient} <span className="font-mono text-xs text-slate">{rx.id}</span></p>
                  <p className="text-xs text-slate mt-0.5">{rx.doctor} · {formatDate(rx.date)} · {rx.items.length} medicine{rx.items.length>1?'s':''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-outline py-1.5 text-xs" onClick={()=>setSelected(rx)}>View</button>
                  <button className="btn-primary py-1.5 text-xs" onClick={()=>{exportPrescriptionPDF(rx); toast.success(`${rx.id}.pdf downloaded`);}}>Export PDF</button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {rx.items.map((it,i)=><span key={i} className="text-xs px-2 py-0.5 rounded-full bg-paper dark:bg-inkdark border border-line dark:border-linedark">{it.medicine}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Prescription ${selected?.id ?? ''}`}>
        {selected && <div className="space-y-3 text-sm">
          <p><span className="mini-tag mr-2">PATIENT</span>{selected.patient}</p>
          <p><span className="mini-tag mr-2">DOCTOR</span>{selected.doctor}</p>
          <p><span className="mini-tag mr-2">DATE</span>{formatDate(selected.date)}</p>
          <div className="rounded-lg border border-line dark:border-linedark overflow-hidden text-xs">
            {selected.items.map((it,i)=>(
              <div key={i} className={`px-3 py-2 grid grid-cols-[1.4fr_2fr] gap-2 ${i>0?'border-t border-line dark:border-linedark':''}`}>
                <span className="font-medium">{it.medicine}</span>
                <span className="text-slate">{it.dose} · {it.frequency} · {it.duration}</span>
              </div>
            ))}
          </div>
          {selected.notes && <p className="text-slate"><span className="mini-tag mr-2">NOTES</span>{selected.notes}</p>}
          <Button className="w-full" onClick={()=>exportPrescriptionPDF(selected)}>Download PDF</Button>
        </div>}
      </Modal>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="New Prescription">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mini-tag mb-1 block">Patient</label>
              <select className="field" {...register('patient')}>
                <option value="">Select…</option>
                {mockPatients.slice(0,14).map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              {errors.patient && <p className="text-rose text-xs mt-1">{errors.patient.message}</p>}
            </div>
            <div>
              <label className="mini-tag mb-1 block">Doctor</label>
              <select className="field" {...register('doctor')}>
                <option value="">Select…</option>
                {mockDoctors.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
              {errors.doctor && <p className="text-rose text-xs mt-1">{errors.doctor.message}</p>}
            </div>
          </div>

          <p className="mini-tag pt-1">MEDICINES</p>
          {typeof errors.items?.message==='string' && <p className="text-rose text-xs">{errors.items.message}</p>}
          <div className="space-y-3 max-h-64 overflow-auto pr-1">
            {fields.map((f,i)=>(
              <div key={f.id} className="card p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="mini-tag">ITEM {i+1}</span>
                  {fields.length>1 && <button type="button" className="text-rose text-xs" onClick={()=>remove(i)}>Remove</button>}
                </div>
                <div>
                  <select className="field" {...register(`items.${i}.medicine` as const)}>
                    <option value="">Select medicine…</option>
                    {[...new Set([...mockMedicines.map(m=>m.name),'Atorvastatin 10mg','Calcium + Vitamin D3','Iron + Folic Acid'])].map(m=><option key={m}>{m}</option>)}
                  </select>
                  {errors.items?.[i]?.medicine && <p className="text-rose text-xs mt-1">{String(errors.items[i]?.medicine?.message)}</p>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Dose" {...register(`items.${i}.dose` as const)} error={errors.items?.[i]?.dose?.message}/>
                  <Input placeholder="Frequency" {...register(`items.${i}.frequency` as const)} error={errors.items?.[i]?.frequency?.message}/>
                  <Input placeholder="Duration" {...register(`items.${i}.duration` as const)} error={errors.items?.[i]?.duration?.message}/>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="btn-outline w-full" onClick={()=>append({medicine:'',dose:'1 tablet',frequency:'Once daily',duration:'7 days'})}>+ Add Medicine Row</button>
          <Input label="Advice / Notes (optional)" placeholder="e.g. Avoid oily food" {...register('notes')}/>
          <Button type="submit" className="w-full">Save & Issue</Button>
        </form>
      </Modal>
    </div>
  );
}
