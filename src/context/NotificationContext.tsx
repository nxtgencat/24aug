import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { NotificationItem } from '../types';

const seed: NotificationItem[] = [
  {id:'1', title:'New Appointment', message:'Aarav Mehta booked with Dr. Aditi', time:'2m ago', read:false, type:'appointment'},
  {id:'2', title:'Prescription Ready', message:'Rx for P-1002 is ready', time:'1h ago', read:false, type:'prescription'},
  {id:'3', title:'Billing Pending', message:'Invoice #INV-102 pending', time:'3h ago', read:true, type:'billing'},
];

export const NotificationContext = createContext<{items:NotificationItem[], markRead:(id:string)=>void, unread:number}>({
  items: seed, markRead:()=>{}, unread:2
});

export function NotificationProvider({children}:{children:ReactNode}){
  const [items,setItems]=useState<NotificationItem[]>(seed);
  const markRead=(id:string)=> setItems(prev=>prev.map(i=>i.id===id?{...i, read:true}:i));
  const unread = items.filter(i=>!i.read).length;
  return <NotificationContext.Provider value={{items, markRead, unread}}>{children}</NotificationContext.Provider>;
}
