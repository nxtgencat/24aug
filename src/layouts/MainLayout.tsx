import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useContext, useState } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import PhaseBanner from '../components/PhaseBanner';

const nav = [
  {to:'/dashboard', label:'Dashboard', perm:'*'},
  {to:'/patients', label:'Patients', perm:'patients'},
  {to:'/doctors', label:'Doctors', perm:'*'},
  {to:'/appointments', label:'Appointments', perm:'appointments'},
  {to:'/records', label:'Records', perm:'medical_records'},
  {to:'/prescriptions', label:'Prescriptions', perm:'prescriptions'},
  {to:'/lab', label:'Laboratory', perm:'*'},
  {to:'/pharmacy', label:'Pharmacy', perm:'*'},
  {to:'/billing', label:'Billing', perm:'*'},
  {to:'/reports', label:'Reports', perm:'*'},
];

export default function MainLayout(){
  const { user, logout, switchRole } = useAuth();
  const { unread } = useContext(NotificationContext);
  const [open,setOpen]=useState(false);
  const navgt = useNavigate();
  if(!user) return null;
  const isAdmin = user.role==='admin';
  return (
    <div className="min-h-screen bg-paper dark:bg-inkdark">
      <PhaseBanner phase={1}/>
      {/* topbar */}
      <header className="sticky top-0 z-40 bg-paper/90 dark:bg-inkdark/90 backdrop-blur border-b border-line dark:border-linedark">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={()=>setOpen(!open)} className="btn-icon lg:hidden">☰</button>
            <span className="w-8 h-8 rounded-md bg-ink dark:bg-paperdark text-paper dark:text-inkdark grid place-content-center font-display font-semibold rotate-[-4deg]">H</span>
            <span className="font-display font-semibold">MediCare HMS</span>
            <span className="hidden sm:inline ticket-tag ml-2">{user.role.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <select value={user.role} onChange={e=>switchRole(e.target.value as any)} className="field py-1.5 text-xs w-auto">
              <option value="admin">Admin</option><option value="doctor">Doctor</option><option value="receptionist">Receptionist</option><option value="patient">Patient</option>
            </select>
            <button onClick={()=>navgt('/notifications')} className="btn-icon relative">🔔{unread>0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose text-white text-[10px] grid place-items-center">{unread}</span>}</button>
            <button onClick={()=>{logout(); navgt('/login');}} className="btn-outline py-1.5">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">
        <aside className={`${open?'block':'hidden'} lg:block w-56 shrink-0 border-r border-line dark:border-linedark min-h-[calc(100vh-112px)] p-6 sticky top-16 self-start`}>
          <nav className="space-y-1">
            {nav.filter(n=> isAdmin || n.perm==='*' || n.perm==='patients').map(n=>(
              <NavLink key={n.to} to={n.to} onClick={()=>setOpen(false)} className={({isActive})=>`block px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-ink dark:bg-paperdark text-paper dark:text-inkdark font-medium':'text-slate hover:bg-ink/5 dark:hover:bg-white/5'}`}>{n.label}</NavLink>
            ))}
          </nav>
          <div className="mt-8 card p-4">
            <p className="mini-tag">PHASE 1 DEMO</p>
            <p className="text-xs mt-2 text-slate">Show sidebar role-switch + dashboard to team. Phase 2 adds full flows.</p>
          </div>
        </aside>
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
