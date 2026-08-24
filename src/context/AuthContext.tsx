import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Role, User } from '../types';

interface AuthCtx {
  user: User | null;
  login: (email:string, role:Role) => void;
  logout: () => void;
  switchRole: (r:Role)=>void;
}
export const AuthContext = createContext<AuthCtx>({ user:null, login:()=>{}, logout:()=>{}, switchRole:()=>{} });

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User|null>(()=>{
    const s=localStorage.getItem('hms_user');
    return s ? JSON.parse(s) : null;
  });

  useEffect(()=>{
    if(user) localStorage.setItem('hms_user', JSON.stringify(user));
    else localStorage.removeItem('hms_user');
  },[user]);

  // auto logout after 30 min inactivity
  useEffect(()=>{
    if(!user) return;
    const t=setTimeout(()=>{ localStorage.removeItem('hms_token'); localStorage.removeItem('hms_user'); setUser(null); }, 30*60*1000);
    return ()=>clearTimeout(t);
  },[user]);

  const login=(email:string, role:Role)=>{
    const u:User={id:'U-1', name: email.split('@')[0], email, role};
    localStorage.setItem('hms_token','demo-token-'+Date.now());
    setUser(u);
  };
  const logout=()=>{ localStorage.removeItem('hms_token'); setUser(null); };
  const switchRole=(r:Role)=>{ if(user) setUser({...user, role:r}); };

  return <AuthContext.Provider value={{user,login,logout,switchRole}}>{children}</AuthContext.Provider>;
}
