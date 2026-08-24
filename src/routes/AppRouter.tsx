import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import Loader from '../components/ui/Loader';

const Login = lazy(()=>import('../pages/Login'));
const Register = lazy(()=>import('../pages/Register'));
const Dashboard = lazy(()=>import('../pages/Dashboard'));
const Patients = lazy(()=>import('../pages/Patients'));
const Doctors = lazy(()=>import('../pages/Doctors'));
const UIPreview = lazy(()=>import('../pages/UIPreview'));
const Generic = lazy(()=>import('../pages/GenericPlaceholder'));

import { useAuth } from '../hooks/useAuth';

function Protected({children}:{children:React.ReactNode}){
  const { user } = useAuth();
  if(!user) return <Navigate to="/login" replace/>;
  return children as any;
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace/> },
  { element: <AuthLayout/>, children: [
    { path: '/login', element: <Suspense fallback={<Loader/>}><Login/></Suspense> },
    { path: '/register', element: <Suspense fallback={<Loader/>}><Register/></Suspense> },
    { path: '/forgot', element: <Suspense fallback={<Loader/>}><div className="card w-full max-w-md">Forgot password — demo: use any role to login</div></Suspense> },
  ]},
  { element: <Protected><MainLayout/></Protected>, children: [
    { path: '/dashboard', element: <Suspense fallback={<Loader/>}><Dashboard/></Suspense> },
    { path: '/patients', element: <Suspense fallback={<Loader/>}><Patients/></Suspense> },
    { path: '/doctors', element: <Suspense fallback={<Loader/>}><Doctors/></Suspense> },
    { path: '/appointments', element: <Suspense fallback={<Loader/>}><Generic title="Appointments"/></Suspense> },
    { path: '/records', element: <Suspense fallback={<Loader/>}><Generic title="Records"/></Suspense> },
    { path: '/prescriptions', element: <Suspense fallback={<Loader/>}><Generic title="Prescriptions"/></Suspense> },
    { path: '/lab', element: <Suspense fallback={<Loader/>}><Generic title="Laboratory"/></Suspense> },
    { path: '/pharmacy', element: <Suspense fallback={<Loader/>}><Generic title="Pharmacy"/></Suspense> },
    { path: '/billing', element: <Suspense fallback={<Loader/>}><Generic title="Billing"/></Suspense> },
    { path: '/reports', element: <Suspense fallback={<Loader/>}><Generic title="Reports"/></Suspense> },
    { path: '/notifications', element: <Suspense fallback={<Loader/>}><Generic title="Notifications" note="Bell count + list with mark-as-read — Phase 2 adds EmailJS triggers"/></Suspense> },
    { path: '/ui-preview', element: <Suspense fallback={<Loader/>}><UIPreview/></Suspense> },
  ]},
  { path: '*', element: <div className="p-10 text-center"><p className="font-display text-2xl">404 — Not Found</p><a href="/dashboard" className="text-cobalt underline">Go Dashboard</a></div> }
]);
