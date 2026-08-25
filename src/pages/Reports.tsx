import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { mockPatients, mockAppointments, mockInvoices, mockMedicines } from '../services/mockData';
import type { Patient, Appointment, Invoice, Medicine } from '../types';
import { exportCSV, exportExcel, exportTablePDF } from '../services/exporters';
import type { ExportRow } from '../services/exporters';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DATASETS = ['Patients','Appointments','Billing','Pharmacy'] as const;
type Dataset = typeof DATASETS[number];

function rowsFor(ds: Dataset): ExportRow[] {
  switch(ds){
    case 'Patients':
      return mockPatients.map((p:Patient)=>({ ID:p.id, Name:p.name, Gender:p.gender, Age:p.age, BloodGroup:p.bloodGroup, Mobile:p.mobile, Status:p.status }));
    case 'Appointments':
      return mockAppointments.map((a:Appointment)=>({ ID:a.id, Patient:a.patient, Doctor:a.doctor, Date:dayjs(a.date).format('YYYY-MM-DD'), Time:a.time, Type:a.type, Status:a.status }));
    case 'Billing': {
      const lines:ExportRow[] = mockInvoices.map((inv:Invoice)=>{
        const amt=inv.items.reduce((s,i)=>s+i.amount,0);
        return { InvoiceID:inv.id, Patient:inv.patient, Date:dayjs(inv.date).format('YYYY-MM-DD'), Lines:inv.items.length, AmountINR:amt, Status:inv.status };
      });
      const total = mockInvoices.reduce((sum,inv)=>sum+inv.items.reduce((s,i)=>s+i.amount,0),0);
      return [...lines, { InvoiceID:'—', Patient:'TOTAL', Date:'', Lines:'', AmountINR:total, Status:'' }];
    }
    case 'Pharmacy':
      return mockMedicines.map((m:Medicine)=>({ ID:m.id, Medicine:m.name, Category:m.category, Stock:m.stock, PriceINR:m.price, ValueINR:m.stock*m.price, Supplier:m.supplier }));
  }
}

export default function Reports(){
  const [ds,setDs]=useState<Dataset>('Patients');
  const rows=useMemo(()=>rowsFor(ds),[ds]);
  const preview=rows.slice(0,5);
  const headers=rows.length?Object.keys(rows[0]):[];

  const chart=useMemo(()=>{
    if(ds!=='Appointments') return [];
    const next7=Array.from({length:7},(_,i)=>dayjs().add(i+1,'day').format('MMM D'));
    return next7.map(d=>({ name:d, count:mockAppointments.filter(a=>dayjs(a.date).format('MMM D')===d).length }));
  },[ds]);

  const run=(fmt:'csv'|'xlsx'|'pdf')=>{
    const file=`medicare-${ds.toLowerCase()}`;
    if(fmt==='csv'){ exportCSV(file, rows); toast.success(`${file}.csv downloaded`); }
    else if(fmt==='xlsx'){ exportExcel(file, ds, rows); toast.success(`${file}.xlsx downloaded`); }
    else { exportTablePDF(file, `${ds} Report`, 'MediCare HMS', rows); toast.success(`${file}.pdf downloaded`); }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="ticket-tag">REPORTS · PDF / EXCEL / CSV</span>
        <h1 className="font-display text-2xl font-semibold mt-2">Reports & Exports</h1>
        <p className="text-slate text-sm mt-1">Pick a dataset, preview it, then export in any format.</p>
      </div>

      <div className="card flex flex-wrap gap-2 items-center">
        {DATASETS.map(d=>(
          <button key={d} onClick={()=>setDs(d)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${d===ds?'bg-ink dark:bg-paperdark text-paper dark:text-inkdark':'border border-line dark:border-linedark hover:border-ink dark:hover:border-paperdark'}`}>
            {d}
          </button>
        ))}
        <span className="mini-tag ml-auto">{rows.length} records · preview shows first 5</span>
      </div>

      {ds==='Appointments' && chart.length>0 && (
        <div className="card">
          <p className="mini-tag mb-4">APPOINTMENTS — NEXT 7 DAYS</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis allowDecimals={false} tick={{fontSize:11}}/><Tooltip/><Bar dataKey="count" fill="#2A4CDB" radius={[6,6,0,0]}/></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <Table headers={headers} rows={preview.map(r=>headers.map(h=>String(r[h]??'')))}/>

      <div className="flex flex-wrap gap-3">
        <Button onClick={()=>run('pdf')}>Export PDF</Button>
        <Button variant="outline" onClick={()=>run('xlsx')}>Export Excel</Button>
        <Button variant="secondary" onClick={()=>run('csv')}>Export CSV</Button>
      </div>
    </div>
  );
}
