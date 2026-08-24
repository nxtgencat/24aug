import { useState, useMemo } from 'react';
import { mockDoctors } from '../services/mockData';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';

export default function Doctors(){
  const [q,setQ]=useState(''); const [dept,setDept]=useState('All');
  const filtered=useMemo(()=>{
    let arr=[...mockDoctors];
    if(q) arr=arr.filter(d=>d.name.toLowerCase().includes(q.toLowerCase()));
    if(dept!=='All') arr=arr.filter(d=>d.department===dept);
    return arr;
  },[q,dept]);
  return (
    <div className="space-y-4">
      <div>
        <span className="ticket-tag">DOCTOR MANAGEMENT</span>
        <h1 className="font-display text-2xl font-semibold mt-2">Doctors</h1>
      </div>
      <div className="card flex flex-wrap gap-3 items-center">
        <SearchBar value={q} onChange={setQ} placeholder="Search doctor"/>
        <select className="field w-auto" value={dept} onChange={e=>setDept(e.target.value)}>
          <option>All</option><option>Cardiology</option><option>Neurology</option><option>Orthopedics</option><option>Pediatrics</option><option>Dermatology</option><option>General</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d=>(
          <div key={d.id} className="card">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-ink dark:bg-paperdark text-paper dark:text-inkdark grid place-items-center font-display font-semibold">{d.name.split(' ')[1][0]}</div>
              <div>
                <p className="font-medium text-sm">{d.name}</p>
                <p className="text-xs text-slate">{d.department} · {d.qualification}</p>
                <Badge variant={d.status==='Available'?'success':d.status==='Busy'?'warning':'danger'}>{d.status}</Badge>
              </div>
            </div>
            <div className="mt-3 text-xs space-y-1">
              <p>Exp: {d.experience}y · ₹{d.fee} fee</p>
              <p className="text-slate">{d.availability}</p>
              <p className="font-mono">{d.mobile} · {d.email}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-outline py-1.5 text-xs flex-1">View Calendar</button>
              <button className="btn-primary py-1.5 text-xs flex-1">Book</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
