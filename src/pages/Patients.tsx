import { useState, useMemo } from 'react';
import { mockPatients } from '../services/mockData';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import FileUpload from '../components/ui/FileUpload';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { paginate } from '../utils/helpers';

export default function Patients(){
  const [q,setQ]=useState(''); const [status,setStatus]=useState('All'); const [page,setPage]=useState(1); const [selected,setSelected]=useState<any>(null);
  const [sortAsc,setSortAsc]=useState(true); const [showAdd,setShowAdd]=useState(false);
  const perPage=6;
  const filtered = useMemo(()=>{
    let arr=[...mockPatients];
    if(q) arr=arr.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase()));
    if(status!=='All') arr=arr.filter(p=>p.status===status);
    arr.sort((a,b)=> sortAsc? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    return arr;
  },[q,status,sortAsc]);
  const total=Math.ceil(filtered.length/perPage);
  const pageData=paginate(filtered,page,perPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <span className="ticket-tag">PATIENT MANAGEMENT · CRUD</span>
          <h1 className="font-display text-2xl font-semibold mt-2">Patients <span className="text-slate font-normal text-lg">({filtered.length})</span></h1>
        </div>
        <Button onClick={()=>setShowAdd(true)}>+ Add Patient</Button>
      </div>

      <div className="card flex flex-wrap gap-3 items-center">
        <SearchBar value={q} onChange={setQ} placeholder="Search name or ID"/>
        <select className="field w-auto" value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}}>
          <option>All</option><option>Active</option><option>Admitted</option><option>Discharged</option>
        </select>
        <button onClick={()=>setSortAsc(!sortAsc)} className="btn-outline py-2">Sort {sortAsc ? 'A→Z' : 'Z→A'}</button>
        <span className="mini-tag ml-auto">{pageData.length} of {filtered.length}</span>
      </div>

      <div className="grid gap-3">
        {pageData.map(p=>(
          <div key={p.id} className="card flex flex-wrap gap-4 items-center justify-between">
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
              <button className="btn-outline py-1.5 text-xs">Edit</button>
              <button className="btn-ghost py-1.5 text-xs text-rose">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={total} onChange={setPage}/>

      {/* view modal */}
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name}>
        {selected && <div className="space-y-3 text-sm">
          <p><span className="mini-tag">Email:</span> {selected.email}</p>
          <p><span className="mini-tag">Address:</span> {selected.address}</p>
          <p><span className="mini-tag">Insurance:</span> {selected.insurance}</p>
          <p><span className="mini-tag">History:</span> {selected.medicalHistory}</p>
          <FileUpload label="Upload Insurance Document"/>
        </div>}
      </Modal>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Patient">
        <div className="space-y-3">
          <Input label="Name" placeholder="Full name"/>
          <div className="grid grid-cols-2 gap-3"><Input label="Age" placeholder="30"/><Input label="Mobile" placeholder="98..."/></div>
          <FileUpload label="Profile Photo"/>
          <Button className="w-full" onClick={()=>setShowAdd(false)}>Save Patient</Button>
        </div>
      </Modal>
    </div>
  );
}
