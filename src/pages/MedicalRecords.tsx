import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { mockRecords, mockDoctors, mockPatients } from '../services/mockData';
import type { MedicalRecord } from '../types';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FileUpload from '../components/ui/FileUpload';
import EmptyState from '../components/ui/EmptyState';
import { paginate, formatDate } from '../utils/helpers';

const schema = yup.object({
  patient: yup.string().required('Select a patient'),
  doctor: yup.string().required('Select a doctor'),
  date: yup.string().required(),
  diagnosis: yup.string().min(3,'Too short').required('Diagnosis is required'),
  treatment: yup.string().min(3,'Too short').required('Treatment is required'),
  notes: yup.string(),
});
type FormValues = yup.InferType<typeof schema>;

export default function MedicalRecords(){
  const [records,setRecords]=useState<MedicalRecord[]>(mockRecords);
  const [q,setQ]=useState(''); const [page,setPage]=useState(1);
  const [selected,setSelected]=useState<MedicalRecord|null>(null);
  const [showAdd,setShowAdd]=useState(false);
  const perPage=6;

  const { register, handleSubmit, reset, formState:{errors} } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues:{ patient:'', doctor:'', date: dayjs().format('YYYY-MM-DD'), diagnosis:'', treatment:'', notes:'' },
  });

  const filtered = useMemo(()=>{
    let arr=[...records];
    if(q) arr=arr.filter(r=>`${r.patient} ${r.diagnosis} ${r.doctor} ${r.id}`.toLowerCase().includes(q.toLowerCase()));
    return arr.sort((a,b)=>b.date.localeCompare(a.date));
  },[records,q]);

  const totalPages=Math.max(1, Math.ceil(filtered.length/perPage));
  const pageData=paginate(filtered,page,perPage);

  const onSubmit=(data:FormValues)=>{
    setRecords(prev=>[{ id:`R-${3000+prev.length+1}`, ...data }, ...prev]);
    setShowAdd(false); reset(); setPage(1);
    toast.success('Record added');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <span className="ticket-tag">MEDICAL RECORDS · CRUD</span>
          <h1 className="font-display text-2xl font-semibold mt-2">Medical Records <span className="text-slate font-normal text-lg">({filtered.length})</span></h1>
        </div>
        <Button onClick={()=>setShowAdd(true)}>+ Add Record</Button>
      </div>

      <div className="card">
        <SearchBar value={q} onChange={v=>{setQ(v); setPage(1);}} placeholder="Search patient, diagnosis or doctor"/>
      </div>

      {pageData.length===0 ? <EmptyState title="No records found" desc="Try another search or add a new record."/> : (
        <div className="grid gap-3">
          {pageData.map(r=>(
            <div key={r.id} className="card py-4 space-y-1">
              <div className="flex flex-wrap justify-between gap-3 items-start">
                <div>
                  <p className="font-medium text-sm">{r.patient} <span className="font-mono text-xs text-slate">{r.id}</span></p>
                  <p className="text-xs text-slate mt-0.5">{formatDate(r.date)} · {r.doctor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-outline py-1.5 text-xs" onClick={()=>setSelected(r)}>View</button>
                  <button className="btn-ghost py-1.5 text-xs text-rose" onClick={()=>{setRecords(prev=>prev.filter(x=>x.id!==r.id)); toast.info(`Deleted ${r.id}`);}}>Delete</button>
                </div>
              </div>
              <p className="text-sm"><span className="mini-tag mr-2">DIAGNOSIS</span>{r.diagnosis}</p>
              <p className="text-sm text-slate"><span className="mini-tag mr-2">TREATMENT</span>{r.treatment}</p>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage}/>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Record ${selected?.id ?? ''}`}>
        {selected && <div className="space-y-3 text-sm">
          <p><span className="mini-tag mr-2">PATIENT</span>{selected.patient}</p>
          <p><span className="mini-tag mr-2">DOCTOR</span>{selected.doctor}</p>
          <p><span className="mini-tag mr-2">DATE</span>{formatDate(selected.date)}</p>
          <p><span className="mini-tag mr-2">DIAGNOSIS</span>{selected.diagnosis}</p>
          <p><span className="mini-tag mr-2">TREATMENT</span>{selected.treatment}</p>
          {selected.notes && <p><span className="mini-tag mr-2">NOTES</span>{selected.notes}</p>}
          <FileUpload label="Attach scan / document"/>
        </div>}
      </Modal>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Medical Record">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="mini-tag mb-1 block">Patient</label>
            <select className="field" {...register('patient')}>
              <option value="">Select patient…</option>
              {mockPatients.slice(0,14).map(p=><option key={p.id} value={p.name}>{p.name} ({p.id})</option>)}
            </select>
            {errors.patient && <p className="text-rose text-xs mt-1">{errors.patient.message}</p>}
          </div>
          <div>
            <label className="mini-tag mb-1 block">Doctor</label>
            <select className="field" {...register('doctor')}>
              <option value="">Select doctor…</option>
              {mockDoctors.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
            {errors.doctor && <p className="text-rose text-xs mt-1">{errors.doctor.message}</p>}
          </div>
          <Input label="Date" type="date" {...register('date')}/>
          <Input label="Diagnosis" placeholder="e.g. Hypertension Stage 1" {...register('diagnosis')} error={errors.diagnosis?.message}/>
          <Input label="Treatment" placeholder="e.g. Medication + diet plan" {...register('treatment')} error={errors.treatment?.message}/>
          <Input label="Notes (optional)" placeholder="Follow-up instructions" {...register('notes')}/>
          <Button type="submit" className="w-full">Save Record</Button>
        </form>
      </Modal>
    </div>
  );
}
