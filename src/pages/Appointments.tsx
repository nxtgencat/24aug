import { useState, useMemo, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { mockAppointments, mockDoctors, mockPatients } from '../services/mockData';
import { NotificationContext } from '../context/NotificationContext';
import type { Appointment } from '../types';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { paginate, formatDate } from '../utils/helpers';

const SLOTS = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM'];
const TYPES = ['Consultation','Follow-up','Emergency'];

const schema = yup.object({
  patient: yup.string().required('Select a patient'),
  doctor: yup.string().required('Select a doctor'),
  date: yup.string().required('Pick a date').test('future','Date cannot be in the past', v=>!v || !dayjs(v).isBefore(dayjs(), 'day')),
  time: yup.string().required('Pick a time slot'),
  type: yup.string().oneOf(TYPES).required(),
});
type FormValues = yup.InferType<typeof schema>;

const statusVariant = (s: Appointment['status']) => s==='Upcoming' ? 'warning' : s==='Completed' ? 'success' : 'danger';

export default function Appointments(){
  const { push } = useContext(NotificationContext);
  const [list,setList]=useState<Appointment[]>(mockAppointments);
  const [q,setQ]=useState(''); const [status,setStatus]=useState('All'); const [page,setPage]=useState(1);
  const [showBook,setShowBook]=useState(false);
  const perPage=6;

  const { register, handleSubmit, reset, formState:{errors} } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues:{ patient:'', doctor:'', date: dayjs().format('YYYY-MM-DD'), time:'', type:'Consultation' },
  });

  const counts = useMemo(()=>({
    upcoming: list.filter(a=>a.status==='Upcoming').length,
    completed: list.filter(a=>a.status==='Completed').length,
    cancelled: list.filter(a=>a.status==='Cancelled').length,
  }),[list]);

  const filtered = useMemo(()=>{
    let arr=[...list];
    if(q) arr=arr.filter(a=>`${a.patient} ${a.doctor} ${a.id}`.toLowerCase().includes(q.toLowerCase()));
    if(status!=='All') arr=arr.filter(a=>a.status===status);
    return arr.sort((a,b)=> a.date.localeCompare(b.date));
  },[q,status,list]);

  const totalPages=Math.max(1, Math.ceil(filtered.length/perPage));
  const pageData=paginate(filtered, page, perPage);

  const onSubmit=(data:FormValues)=>{
    const next:Appointment={ id:`A-${2000+list.length+1}`, status:'Upcoming', ...data };
    setList(prev=>[next,...prev]);
    setShowBook(false); reset(); setPage(1);
    toast.success(`Booked: ${data.patient} → ${data.doctor}`);
    push({ title:'Appointment Booked', message:`${data.patient} → ${data.doctor} · ${formatDate(data.date)} ${data.time}`, type:'appointment' });
  };

  const setStatusFor=(a:Appointment, s:Appointment['status'])=>{
    setList(prev=>prev.map(x=>x.id===a.id?{...x,status:s}:x));
    toast.info(`Appointment ${a.id} marked ${s.toLowerCase()}`);
    if(s==='Cancelled') push({ title:'Appointment Cancelled', message:`${a.patient} with ${a.doctor} (${formatDate(a.date)})`, type:'appointment' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <span className="ticket-tag">APPOINTMENTS · FULL CRUD</span>
          <h1 className="font-display text-2xl font-semibold mt-2">Appointments</h1>
        </div>
        <Button onClick={()=>setShowBook(true)}>+ Book Appointment</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          {label:'UPCOMING', value:counts.upcoming, cls:'text-amber'},
          {label:'COMPLETED', value:counts.completed, cls:'text-mint'},
          {label:'CANCELLED', value:counts.cancelled, cls:'text-rose'},
        ].map(s=>(
          <div key={s.label} className="card py-4">
            <p className="mini-tag">{s.label}</p>
            <p className={`font-display text-2xl font-semibold mt-1 ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card flex flex-wrap gap-3 items-center">
        <SearchBar value={q} onChange={v=>{setQ(v); setPage(1);}} placeholder="Search patient, doctor or ID"/>
        <select className="field w-auto" value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}}>
          <option>All</option><option>Upcoming</option><option>Completed</option><option>Cancelled</option>
        </select>
        <span className="mini-tag ml-auto">{filtered.length} appointments</span>
      </div>

      {pageData.length===0 ? <EmptyState title="No appointments found" desc="Try clearing filters or book a new appointment."/> : (
        <div className="grid gap-3">
          {pageData.map(a=>(
            <div key={a.id} className="card flex flex-wrap gap-4 items-center justify-between py-4">
              <div>
                <p className="font-medium text-sm">{a.patient} <span className="font-mono text-xs text-slate">{a.id}</span></p>
                <p className="text-xs text-slate mt-0.5">{a.doctor} · {formatDate(a.date)} · {a.time}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={a.type==='Emergency'?'danger':'default'}>{a.type}</Badge>
                <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                {a.status==='Upcoming' && <>
                  <button className="btn-outline py-1.5 text-xs" onClick={()=>setStatusFor(a,'Completed')}>Complete</button>
                  <button className="btn-ghost py-1.5 text-xs text-rose" onClick={()=>setStatusFor(a,'Cancelled')}>Cancel</button>
                </>}
                {a.status!=='Upcoming' && <button className="btn-ghost py-1.5 text-xs text-rose" onClick={()=>{setList(prev=>prev.filter(x=>x.id!==a.id)); toast.info(`Deleted ${a.id}`);}}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage}/>

      <Modal open={showBook} onClose={()=>setShowBook(false)} title="Book Appointment">
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
              {mockDoctors.map(d=><option key={d.id} value={d.name} disabled={d.status==='On Leave'}>{d.name} — {d.department}{d.status==='On Leave' ? ' (on leave)' : ''}</option>)}
            </select>
            {errors.doctor && <p className="text-rose text-xs mt-1">{errors.doctor.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" {...register('date')} error={errors.date?.message}/>
            <div>
              <label className="mini-tag mb-1 block">Time Slot</label>
              <select className="field" {...register('time')}>
                <option value="">Select slot…</option>
                {SLOTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              {errors.time && <p className="text-rose text-xs mt-1">{errors.time.message}</p>}
            </div>
          </div>
          <div>
            <label className="mini-tag mb-1 block">Type</label>
            <select className="field" {...register('type')}>{TYPES.map(t=><option key={t}>{t}</option>)}</select>
          </div>
          <Button type="submit" className="w-full">Confirm Booking</Button>
        </form>
      </Modal>
    </div>
  );
}
