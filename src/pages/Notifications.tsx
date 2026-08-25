import { useContext } from 'react';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import { NotificationContext } from '../context/NotificationContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const typeVariant = (t:string)=> t==='billing' ? 'warning' : t==='lab' ? 'success' : t==='pharmacy' ? 'danger' : 'default';

export default function Notifications(){
  const { items, markRead, unread } = useContext(NotificationContext);

  const markAll=()=>{ items.filter(i=>!i.read).forEach(i=>markRead(i.id)); toast.success('All notifications marked read'); };

  const sendDigest=async ()=>{
    const svc=import.meta.env.VITE_EMAILJS_SERVICE;
    const tpl=import.meta.env.VITE_EMAILJS_TEMPLATE;
    const key=import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const summary=items.map(i=>`• ${i.title}: ${i.message}`).join('\n');
    if(svc && tpl && key){
      try{
        await emailjs.send(svc, tpl, { title:'MediCare HMS Digest', message:summary }, { publicKey:key });
        toast.success('Digest emailed via EmailJS');
      }catch{ toast.error('EmailJS send failed — check keys'); }
    } else {
      toast.info(`Email digest queued (${items.length} updates) — add EmailJS keys in .env to actually send`);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <span className="ticket-tag">NOTIFICATIONS · MARK AS READ</span>
          <h1 className="font-display text-2xl font-semibold mt-2">Notifications <span className="text-slate font-normal text-lg">{unread>0?`(${unread} unread)`:''}</span></h1>
        </div>
        <div className="flex gap-2">
          {unread>0 && <Button variant="outline" onClick={markAll}>Mark all read</Button>}
          <Button onClick={sendDigest}>Email digest</Button>
        </div>
      </div>

      {items.length===0 ? <EmptyState title="You're all caught up" desc="New alerts will appear here."/> : (
        <div className="grid gap-3">
          {items.map(n=>(
            <div key={n.id} className={`card flex justify-between gap-4 items-center py-4 ${!n.read?'border-cobalt/40':''}`}>
              <div className="flex gap-3 items-start min-w-0">
                {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-cobalt shrink-0"/>}
                <div className="min-w-0">
                  <p className="font-medium text-sm flex items-center gap-2">{n.title} <Badge variant={typeVariant(n.type)}>{n.type}</Badge></p>
                  <p className="text-xs text-slate mt-0.5 truncate">{n.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="mini-tag">{n.time}</span>
                {!n.read
                  ? <button className="btn-outline py-1.5 text-xs" onClick={()=>markRead(n.id)}>Mark read</button>
                  : <span className="text-xs text-mint">✓ read</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
