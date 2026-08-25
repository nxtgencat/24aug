import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { NotificationItem } from '../types';

type PushInput = Omit<NotificationItem, 'id' | 'time' | 'read'>;

const seed: NotificationItem[] = [
  {id:'1', title:'New Appointment', message:'Aarav Mehta booked with Dr. Aditi', time:'2m ago', read:false, type:'appointment'},
  {id:'2', title:'Prescription Ready', message:'Rx for P-1002 is ready', time:'1h ago', read:false, type:'prescription'},
  {id:'3', title:'Billing Pending', message:'Invoice #INV-102 pending', time:'3h ago', read:true, type:'billing'},
];

interface NotificationCtx {
  items: NotificationItem[];
  markRead: (id:string)=>void;
  unread: number;
  push: (n:PushInput)=>void;
}

export const NotificationContext = createContext<NotificationCtx>({
  items: seed, markRead:()=>{}, unread:2, push:()=>{}
});

export function NotificationProvider({children}:{children:ReactNode}){
  const [items,setItems]=useState<NotificationItem[]>(seed);
  const markRead=(id:string)=> setItems(prev=>prev.map(i=>i.id===id?{...i, read:true}:i));
  const unread = items.filter(i=>!i.read).length;
  const push=(n:PushInput)=>{
    setItems(prev=>[{
      id:`${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      time:'just now', read:false, ...n,
    }, ...prev]);
  };
  return <NotificationContext.Provider value={{items, markRead, unread, push}}>{children}</NotificationContext.Provider>;
}
