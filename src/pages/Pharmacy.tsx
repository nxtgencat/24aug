import { useState, useMemo, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { mockMedicines } from '../services/mockData';
import { NotificationContext } from '../context/NotificationContext';
import type { Medicine } from '../types';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { paginate, formatCurrency } from '../utils/helpers';

export const MED_CATEGORIES = ['Analgesic','Antibiotic','Antihistamine','Antidiabetic','Antacid','Cardiac','Electrolyte'];

const schema = yup.object({
  name: yup.string().min(3,'Name too short').required('Name is required'),
  category: yup.string().oneOf(MED_CATEGORIES).required(),
  stock: yup.number().typeError('Stock must be a number').min(0,'Cannot be negative').integer().required(),
  price: yup.number().typeError('Price must be a number').min(1,'Must be at least ₹1').required(),
  supplier: yup.string().min(2,'Supplier required').required(),
});
type FormValues = yup.InferType<typeof schema>;

const LOW_STOCK = 5;

export default function Pharmacy(){
  const { push } = useContext(NotificationContext);
  const [list,setList]=useState<Medicine[]>(mockMedicines);
  const [q,setQ]=useState(''); const [cat,setCat]=useState('All'); const [page,setPage]=useState(1);
  const [showAdd,setShowAdd]=useState(false);
  const perPage=6;

  const { register, handleSubmit, reset, formState:{errors} } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues:{ name:'', category:MED_CATEGORIES[0], stock:0, price:1, supplier:'' },
  });

  const stats = useMemo(()=>{
    const low = list.filter(m=>m.stock<LOW_STOCK);
    return { skus:list.length, lowCount:low.length, value:list.reduce((s,m)=>s+m.stock*m.price,0), low };
  },[list]);

  const filtered = useMemo(()=>{
    let arr=[...list];
    if(q) arr=arr.filter(m=>`${m.name} ${m.supplier}`.toLowerCase().includes(q.toLowerCase()));
    if(cat!=='All') arr=arr.filter(m=>m.category===cat);
    return arr.sort((a,b)=>a.stock-b.stock);
  },[list,q,cat]);

  const totalPages=Math.max(1,Math.ceil(filtered.length/perPage));
  const pageData=paginate(filtered,page,perPage);

  const onSubmit=(data:FormValues)=>{
    setList(prev=>[{ id:`M-${prev.length+1}`, ...data }, ...prev]);
    setShowAdd(false); reset(); setPage(1);
    toast.success(`${data.name} added to inventory`);
    if(data.stock < LOW_STOCK) push({ title:'Low Stock Alert', message:`${data.name} added with only ${data.stock} units`, type:'pharmacy' });
  };

  const restock=(m:Medicine)=>{
    setList(prev=>prev.map(x=>x.id===m.id?{...x,stock:x.stock+20}:x));
    toast.success(`${m.name} restocked +20`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <span className="ticket-tag">PHARMACY · INVENTORY</span>
          <h1 className="font-display text-2xl font-semibold mt-2">Pharmacy</h1>
        </div>
        <Button onClick={()=>setShowAdd(true)}>+ Add Medicine</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card py-4"><p className="mini-tag">TOTAL ITEMS</p><p className="font-display text-2xl font-semibold mt-1">{stats.skus}</p></div>
        <div className="card py-4"><p className="mini-tag">LOW STOCK ALERTS</p><p className={`font-display text-2xl font-semibold mt-1 ${stats.lowCount?'text-rose':'text-mint'}`}>{stats.lowCount}</p></div>
        <div className="card py-4"><p className="mini-tag">INVENTORY VALUE</p><p className="font-display text-2xl font-semibold mt-1">{formatCurrency(stats.value)}</p></div>
      </div>

      {stats.lowCount>0 && (
        <div className="card border-rose/40 !bg-rose/5">
          <p className="text-sm"><Badge variant="danger">{stats.lowCount} low-stock</Badge> <span className="ml-2">Restock soon: {stats.low.map(m=>`${m.name} (${m.stock})`).join(', ')}</span></p>
        </div>
      )}

      <div className="card flex flex-wrap gap-3 items-center">
        <SearchBar value={q} onChange={v=>{setQ(v); setPage(1);}} placeholder="Search medicine or supplier"/>
        <select className="field w-auto" value={cat} onChange={e=>{setCat(e.target.value); setPage(1);}}>
          <option>All</option>{MED_CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
        <span className="mini-tag ml-auto">Sorted by stock (low first)</span>
      </div>

      {pageData.length===0 ? <EmptyState title="No medicines found" desc="Adjust filters or add new inventory."/> : (
        <div className="grid gap-3">
          {pageData.map(m=>(
            <div key={m.id} className="card flex flex-wrap gap-4 items-center justify-between py-4">
              <div>
                <p className="font-medium text-sm">{m.name}</p>
                <p className="text-xs text-slate mt-0.5">{m.category} · Supplier: {m.supplier} · {formatCurrency(m.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                {m.stock<LOW_STOCK ? <Badge variant="danger">Low: {m.stock}</Badge> : <Badge variant="success">Stock: {m.stock}</Badge>}
                <button className="btn-outline py-1.5 text-xs" onClick={()=>restock(m)}>Restock +20</button>
                <button className="btn-ghost py-1.5 text-xs text-rose" onClick={()=>{setList(prev=>prev.filter(x=>x.id!==m.id)); toast.info(`${m.name} removed`);}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage}/>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Medicine">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Medicine name" placeholder="e.g. Paracetamol 650mg" {...register('name')} error={errors.name?.message}/>
          <div>
            <label className="mini-tag mb-1 block">Category</label>
            <select className="field" {...register('category')}>{MED_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Opening stock" type="number" {...register('stock')} error={errors.stock?.message}/>
            <Input label="Price (₹)" type="number" {...register('price')} error={errors.price?.message}/>
          </div>
          <Input label="Supplier" placeholder="e.g. Cipla" {...register('supplier')} error={errors.supplier?.message}/>
          <Button type="submit" className="w-full">Save Medicine</Button>
        </form>
      </Modal>
    </div>
  );
}
