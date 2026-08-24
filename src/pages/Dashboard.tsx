import { dashboardStats, mockAppointments, mockDoctors } from '../services/mockData';
import { formatCurrency } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const chart = [{name:'Mon', rev:42000},{name:'Tue', rev:38000},{name:'Wed', rev:52000},{name:'Thu', rev:48000},{name:'Fri', rev:61000},{name:'Sat', rev:35000},{name:'Sun', rev:28000}];

export default function Dashboard(){
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="ticket-tag">DASHBOARD · PHASE 1</span>
          <h1 className="font-display text-3xl font-semibold mt-2">Overview</h1>
          <p className="text-slate text-sm mt-1">Visual demo for team — cards, charts, activities, quick actions</p>
        </div>
        <a href="/ui-preview" className="btn-outline hidden sm:inline-flex">UI Preview →</a>
      </div>

      {/* stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:'Total Patients', value: dashboardStats.patients, sub:'+12 this week', color:'cobalt'},
          {label:'Total Doctors', value: dashboardStats.doctors, sub:'4 on leave', color:'ink'},
          {label:"Today's Appointments", value: dashboardStats.appointmentsToday, sub:'3 pending', color:'amber'},
          {label:'Revenue', value: formatCurrency(dashboardStats.revenue), sub:'This month', color:'mint'},
        ].map(s=>(
          <div key={s.label} className="card">
            <p className="mini-tag">{s.label}</p>
            <p className="font-display text-2xl font-semibold mt-2">{s.value}</p>
            <p className="text-xs text-slate mt-1">{s.sub}</p>
            <div className="perf mt-4 relative"><span className="perf-notch left"/><span className="perf-notch right"/></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <p className="mini-tag mb-4">REVENUE TREND</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}><XAxis dataKey="name" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}}/><Tooltip/><Bar dataKey="rev" fill="#2A4CDB" radius={[6,6,0,0]}/></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <p className="mini-tag mb-4">APPOINTMENT MIX</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}><Line type="monotone" dataKey="rev" stroke="#1F9D66" strokeWidth={2} dot={false}/><XAxis dataKey="name" hide/><YAxis hide/><Tooltip/></LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Pending Bills</span><Badge variant="warning">{dashboardStats.pendingBills}</Badge></div>
            <div className="flex justify-between"><span>Pharmacy Orders</span><Badge>{dashboardStats.pharmacyOrders}</Badge></div>
            <div className="flex justify-between"><span>Lab Reports</span><Badge variant="success">{dashboardStats.labReports}</Badge></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <p className="mini-tag mb-3">RECENT APPOINTMENTS</p>
          <div className="space-y-2">{mockAppointments.slice(0,5).map(a=><div key={a.id} className="flex justify-between items-center p-3 rounded-lg border border-line dark:border-linedark"><div><p className="text-sm font-medium">{a.patient}</p><p className="text-xs text-slate">{a.doctor} · {a.date} {a.time}</p></div><Badge variant={a.status==='Upcoming'?'warning':a.status==='Completed'?'success':'danger'}>{a.status}</Badge></div>)}</div>
        </div>
        <div className="card">
          <p className="mini-tag mb-3">QUICK ACTIONS</p>
          <div className="grid grid-cols-2 gap-3">
            {['Register Patient','Book Appointment','Create Prescription','Generate Bill'].map(l=><button key={l} className="p-4 rounded-xl border border-line dark:border-linedark hover:border-ink dark:hover:border-paperdark text-sm font-medium text-left">{l} →</button>)}
          </div>
          <p className="mini-tag mt-4 mb-2">DOCTORS ON DUTY</p>
          <div className="flex -space-x-2">{mockDoctors.slice(0,4).map(d=><div key={d.id} className="w-8 h-8 rounded-full bg-cobalt text-white grid place-items-center text-xs border-2 border-surface">{d.name.split(' ')[1][0]}</div>)}</div>
        </div>
      </div>
    </div>
  );
}
