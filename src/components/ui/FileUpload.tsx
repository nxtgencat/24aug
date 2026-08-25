import { useState } from 'react';
type Props = { label?: string; onFile?: (f: File | null) => void };
export default function FileUpload({label, onFile}:{label?:string; onFile?:Props['onFile']}){
  const [file,setFile]=useState<File|null>(null);
  const [progress,setProgress]=useState(0);
  const pick=(f:File)=>{
    if(f.size>5*1024*1024){ alert('Max 5MB'); return; }
    if(!['image/jpeg','image/png','application/pdf'].includes(f.type)){ alert('Only JPG/PNG/PDF'); return; }
    setFile(f); setProgress(0); onFile?.(f);
    let p=0; const id=setInterval(()=>{p+=20; setProgress(p); if(p>=100) clearInterval(id);},200);
  };
  const clear=()=>{ setFile(null); setProgress(0); onFile?.(null); };
  const onPick=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; e.target.value='';
    if(!f) return;
    pick(f);
  };
  return (
    <div className="card">
      {label && <p className="mini-tag mb-2">{label}</p>}
      <label className="border border-dashed border-line dark:border-linedark rounded-lg p-6 grid place-items-center cursor-pointer hover:border-cobalt transition-colors">
        <input type="file" className="hidden" onChange={onPick} accept=".jpg,.png,.pdf"/>
        <span className="text-sm text-slate">Click to upload — JPG/PNG/PDF, max 5MB</span>
      </label>
      {file && <div className="mt-3">
        <p className="text-sm font-medium">{file.name} <span className="text-slate">{(file.size/1024).toFixed(0)} KB</span></p>
        <div className="h-1.5 bg-line dark:bg-linedark rounded-full mt-2 overflow-hidden"><div className="h-full bg-cobalt transition-all" style={{width:`${progress}%`}}/></div>
        <div className="mt-2 flex gap-2">
          {file.type.startsWith('image') ? <img src={URL.createObjectURL(file)} alt="preview" className="w-20 h-20 object-cover rounded-lg border"/> : <div className="w-20 h-20 grid place-items-center bg-paper dark:bg-inkdark rounded-lg border text-xs">PDF</div>}
          <button onClick={clear} className="btn-outline py-1 text-xs">Remove</button>
        </div>
      </div>}
    </div>
  );
}
