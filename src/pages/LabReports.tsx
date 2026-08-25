import { useState, useMemo, useContext } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { mockLabReports, mockPatients } from '../services/mockData';
import { NotificationContext } from '../context/NotificationContext';
import type { LabReport } from '../types';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import FileUpload from '../components/ui/FileUpload';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { paginate, formatDate } from '../utils/helpers';

const TESTS = ['Complete Blood Count','Lipid Profile','HbA1c','Thyroid Panel','Liver Function','Urine Routine','Vitamin D','X-Ray Chest','Ultrasound'];

export default function LabReports(){
  const { push } = useContext(NotificationContext);
  const [reports,setReports]=useState<LabReport[]>(mockLabReports);
  const [q,setQ]=useState(''); const [status,setStatus]=useState('All'); const [page,setPage]=useState(1);
  const [patient,setPatient]=useState(''); const [test,setTest]=useState(TESTS[0]); const [file,setFile]=useState<File|null>(null);
  const perPage=5;

  const filtered = useMemo(()=>{
    let arr=[...reports];
    if(q) arr=arr.filter(r=>`${r.patient} ${r.test} ${r.id}`.toLowerCase().includes(q.toLowerCase()));
    if(status!=='All') arr=arr.filter(r=>r.status===status);
    return arr.sort((a,b)=>b.date.localeCompare(a.date));
  },[reports,q,status]);

  const totalPages=Math.max(1,Math.ceil(filtered.length/perPage));
  const pageData=paginate(filtered,page,perPage);
  const pending=reports.filter(r=>r.status==='Pending').length;

  const upload=()=>{
    if(!patient){ toast.error('Select a patient first'); return; }
    if(!file){ toast.error('Attach a report file (JPG/PNG/PDF)'); return; }
    const report:LabReport={ id:`LR-${7000+reports.length+1}`, patient, test, date:dayjs().format('YYYY-MM-DD'), status:'Pending', fileName:file.name, fileUrl:URL.createObjectURL(file) };
    setReports(prev=>[report,...prev]);
    setPatient(''); setFile(null); setPage(1);
    toast.success(`Report ${report.id} uploaded — awaiting review`);
    push({ title:'Lab Report Uploaded', message:`${report.id} · ${test} for ${patient} — pending review`, type:'lab' });
  };

  const markReady=(id:string)=>{
    const r=reports.find(x=>x.id===id);
    setReports(prev=>prev.map(x=>x.id===id?{...x,status:'Ready'}:x));
    toast.success(`${id} marked Ready`);
    if(r) push({ title:'Lab Report Ready', message:`${r.id} · ${r.test} — results for ${r.patient}`, type:'lab' });
  };

  const downloadFile=(r:LabReport)=>{
    if(r.fileUrl){
      const a=document.createElement('a'); a.href=r.fileUrl; a.download=r.fileName||`${r.id}`; a.click();
    } else {
      toast.info(`${r.id} — no file attached to this seeded record`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="ticket-tag">LABORATORY · UPLOAD + TRACK</span>
        <h1 className="font-display text-2xl font-semibold mt-2">Lab Reports <span className="text-slate font-normal text-lg">({reports.length})</span></h1>
      </div>

      <div className="card space-y-3">
        <p className="mini-tag">UPLOAD NEW REPORT</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <select className="field" value={patient} onChange={e=>setPatient(e.target.value)}>
            <option value="">Select patient…</option>
            {mockPatients.slice(0,14).map(p=><option key={p.id} value={p.name}>{p.name} ({p.id})</option>)}
          </select>
          <select className="field" value={test} onChange={e=>setTest(e.target.value)}>
            {TESTS.map(t=><option key={t}>{t}</option>)}
          </select>
          <Button onClick={upload}>Upload Report</Button>
        </div>
        <FileUpload label="Report file — JPG / PNG / PDF, max 5MB" onFile={setFile}/>
        {file && <p className="text-xs text-slate">Ready to upload: <span className="font-medium text-ink dark:text-paperdark">{file.name}</span></p>}
      </div>

      <div className="card flex flex-wrap gap-3 items-center">
        <SearchBar value={q} onChange={v=>{setQ(v); setPage(1);}} placeholder="Search patient, test or ID"/>
        <select className="field w-auto" value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}}>
          <option>All</option><option>Pending</option><option>Ready</option>
        </select>
        <span className="mini-tag ml-auto">{pending>0 ? <Badge variant="warning">{pending} pending review</Badge> : <Badge variant="success">All reviewed</Badge>}</span>
      </div>

      {pageData.length===0 ? <EmptyState title="No reports found" desc="Upload a report or clear filters."/> : (
        <div className="grid gap-3">
          {pageData.map(r=>(
            <div key={r.id} className="card flex flex-wrap gap-4 items-center justify-between py-4">
              <div>
                <p className="font-medium text-sm">{r.patient} <span className="font-mono text-xs text-slate">{r.id}</span></p>
                <p className="text-xs text-slate mt-0.5">{r.test} · {formatDate(r.date)}{r.summary ? ` · ${r.summary}` : ''}</p>
                {r.fileName && <p className="text-xs text-cobalt mt-0.5 font-mono">{r.fileName}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={r.status==='Ready'?'success':'warning'}>{r.status}</Badge>
                {r.status==='Pending' && <button className="btn-outline py-1.5 text-xs" onClick={()=>markReady(r.id)}>Mark Ready</button>}
                <button className="btn-ghost py-1.5 text-xs" onClick={()=>downloadFile(r)}>Download</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage}/>
    </div>
  );
}
