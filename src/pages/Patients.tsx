import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { mockPatients } from '../services/mockData';
import type { Patient } from '../types';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import FileUpload from '../components/ui/FileUpload';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { paginate } from '../utils/helpers';

const schema = yup.object({
  name: yup.string().min(3,'Name too short').required('Name is required'),
  gender: yup.string().oneOf(['Male','Female','Other']).required(),
  age: yup.number().typeError('Age must be a number').min(0,'Too low').max(120,'Too high').integer().required(),
  mobile: yup.string().matches(/^[6-9]\d{9}$/,'Enter a valid 10-digit mobile').required(),
  email: yup.string().email('Invalid email').required(),
  bloodGroup: yup.string().oneOf(['A+','A-','B+','B-','AB+','AB-','O+','O-']).required(),
  status: yup.string().oneOf(['Active','Admitted','Discharged']).required(),
  address: yup.string().min(5,'Address too short'),
  emergencyContact: yup.string().matches(/^$|^[6-9]\d{9}$/,'Enter a valid 10-digit number'),
  insurance: yup.string(),
  medicalHistory: yup.string(),
});
type FormValues = yup.InferType<typeof schema>;

export default function Patients(){
  const [patients,setPatients]=useState<Patient[]>(mockPatients);
  const [q,setQ]=useState(''); const [status,setStatus]=useState('All'); const [page,setPage]=useState(1); const [selected,setSelected]=useState<Patient|null>(null);
  const [sortAsc,setSortAsc]=useState(true); const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState<Patient|null>(null);
  const perPage=6;

  const { register, handleSubmit, reset, formState:{errors} } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues:{ name:'', gender:'Female', age:undefined, mobile:'', email:'', bloodGroup:'O+', status:'Active', address:'', emergencyContact:'', insurance:'', medicalHistory:'' },
  });

  const openAdd=()=>{ setEditing(null); reset({ name:'', gender:'Female', age:undefined, mobile:'', email:'', bloodGroup:'O+', status:'Active', address:'', emergencyContact:'', insurance:'', medicalHistory:'' }); setShowForm(true); };
  const openEdit=(p:Patient)=>{
    setEditing(p);
    reset({ name:p.name, gender:p.gender, age:p.age, mobile:p.mobile, email:p.email, bloodGroup:p.bloodGroup as FormValues['bloodGroup'], status:p.status, address:p.address, emergencyContact:p.emergencyContact, insurance:p.insurance, medicalHistory:p.medicalHistory });
    setShowForm(true);
  };

  const filtered = useMemo(()=>{
    let arr=[...patients];
    if(q) arr=arr.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase()));
    if(status!=='All') arr=arr.filter(p=>p.status===status);
    arr.sort((a,b)=> sortAsc? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    return arr;
  },[patients,q,status,sortAsc]);

  const total=Math.max(1, Math.ceil(filtered.length/perPage));
  const pageData=paginate(filtered,page,perPage);

  const nextId=()=>`P-${Math.max(...patients.map(p=>Number(p.id.split('-')[1])||0))+1}`;

  const onSubmit=(data:FormValues)=>{
    const payload:Patient = {
      id: editing ? editing.id : nextId(),
      name: data.name,
      gender: data.gender,
      age: data.age,
      mobile: data.mobile,
      email: data.email,
      bloodGroup: data.bloodGroup,
      status: data.status,
      address: data.address ?? '',
      emergencyContact: data.emergencyContact ?? '',
      insurance: data.insurance ?? '',
      medicalHistory: data.medicalHistory ?? '',
    };
    if(editing){
      setPatients(prev=>prev.map(p=>p.id===editing.id?payload:p));
      toast.success(`${data.name} updated`);
      if(selected?.id===editing.id) setSelected(payload);
    } else {
      setPatients(prev=>[payload, ...prev]);
      setPage(1);
      toast.success(`${data.name} registered (${payload.id})`);
    }
    setShowForm(false); setEditing(null);
  };

  const remove=(p:Patient)=>{
    setPatients(prev=>prev.filter(x=>x.id!==p.id));
    if(selected?.id===p.id) setSelected(null);
    toast.info(`${p.name} (${p.id}) deleted`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <span className="ticket-tag">PATIENT MANAGEMENT · CRUD</span>
          <h1 className="font-display text-2xl font-semibold mt-2">Patients <span className="text-slate font-normal text-lg">({filtered.length})</span></h1>
        </div>
        <Button onClick={openAdd}>+ Add Patient</Button>
      </div>

      <div className="card flex flex-wrap gap-3 items-center">
        <SearchBar value={q} onChange={v=>{setQ(v); setPage(1);}} placeholder="Search name or ID"/>
        <select className="field w-auto" value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}}>
          <option>All</option><option>Active</option><option>Admitted</option><option>Discharged</option>
        </select>
        <button onClick={()=>setSortAsc(!sortAsc)} className="btn-outline py-2">Sort {sortAsc ? 'A→Z' : 'Z→A'}</button>
        <span className="mini-tag ml-auto">{pageData.length} of {filtered.length}</span>
      </div>

      {pageData.length===0 ? <EmptyState title="No patients found" desc="Try clearing filters or register a new patient."/> : (
        <div className="grid gap-3">
          {pageData.map(p=>(
            <div key={p.id} className="card flex flex-wrap gap-4 items-center justify-between py-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-cobalt text-white grid place-items-center font-medium">{p.name[0]}</div>
                <div>
                  <p className="font-medium text-sm">{p.name} <span className="font-mono text-xs text-slate">{p.id}</span></p>
                  <p className="text-xs text-slate">{p.gender} · {p.age}y · {p.bloodGroup} · {p.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={p.status==='Active'?'success':p.status==='Admitted'?'warning':'default'}>{p.status}</Badge>
                <button className="btn-ghost py-1.5 text-xs" onClick={()=>setSelected(p)}>View</button>
                <button className="btn-outline py-1.5 text-xs" onClick={()=>openEdit(p)}>Edit</button>
                <button className="btn-ghost py-1.5 text-xs text-rose" onClick={()=>remove(p)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={total} onChange={setPage}/>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name}>
        {selected && <div className="space-y-3 text-sm">
          <p><span className="mini-tag mr-2">ID</span>{selected.id}</p>
          <p><span className="mini-tag mr-2">Email:</span> {selected.email}</p>
          <p><span className="mini-tag mr-2">Mobile:</span> {selected.mobile}</p>
          <p><span className="mini-tag mr-2">Emergency:</span> {selected.emergencyContact}</p>
          <p><span className="mini-tag mr-2">Address:</span> {selected.address}</p>
          <p><span className="mini-tag mr-2">Insurance:</span> {selected.insurance}</p>
          <p><span className="mini-tag mr-2">History:</span> {selected.medicalHistory}</p>
          <FileUpload label="Upload Insurance Document"/>
        </div>}
      </Modal>

      <Modal open={showForm} onClose={()=>{setShowForm(false); setEditing(null);}} title={editing?`Edit ${editing.name}`:'Add Patient'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Full name" placeholder="e.g. Aarav Mehta" {...register('name')} error={errors.name?.message}/>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mini-tag mb-1 block">Gender</label>
              <select className="field" {...register('gender')}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <Input label="Age" type="number" placeholder="30" {...register('age')} error={errors.age?.message}/>
            <div>
              <label className="mini-tag mb-1 block">Blood</label>
              <select className="field" {...register('bloodGroup')}>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Mobile" placeholder="9876543210" {...register('mobile')} error={errors.mobile?.message}/>
            <Input label="Email" placeholder="name@mail.com" {...register('email')} error={errors.email?.message}/>
          </div>
          <Input label="Address" placeholder="Street, City" {...register('address')} error={errors.address?.message}/>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Emergency contact" placeholder="9876543210" {...register('emergencyContact')} error={errors.emergencyContact?.message}/>
            <Input label="Insurance" placeholder="e.g. Star Health" {...register('insurance')}/>
          </div>
          <div>
            <label className="mini-tag mb-1 block">Status</label>
            <select className="field" {...register('status')}>
              <option>Active</option><option>Admitted</option><option>Discharged</option>
            </select>
          </div>
          <Input label="Medical history" placeholder="e.g. Hypertension / No history" {...register('medicalHistory')}/>
          <FileUpload label="Profile Photo"/>
          <Button type="submit" className="w-full">{editing?'Save Changes':'Save Patient'}</Button>
        </form>
      </Modal>
    </div>
  );
}
