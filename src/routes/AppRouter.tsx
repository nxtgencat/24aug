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
const Appointments = lazy(()=>import('../pages/Appointments'));
const MedicalRecords = lazy(()=>import('../pages/MedicalRecords'));
const Prescriptions = lazy(()=>import('../pages/Prescriptions'));
const LabReports = lazy(()=>import('../pages/LabReports'));
const Pharmacy = lazy(()=>import('../pages/Pharmacy'));
const Billing = lazy(()=>import('../pages/Billing'));
const Reports = lazy(()=>import('../pages/Reports'));
const ClinicMap = lazy(()=>import('../pages/ClinicMap'));
const Notifications = lazy(()=>import('../pages/Notifications'));
const NotFound = lazy(()=>import('../pages/NotFound'));

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
    { path: '/appointments', element: <Suspense fallback={<Loader/>}><Appointments/></Suspense> },
    { path: '/records', element: <Suspense fallback={<Loader/>}><MedicalRecords/></Suspense> },
    { path: '/prescriptions', element: <Suspense fallback={<Loader/>}><Prescriptions/></Suspense> },
    { path: '/lab', element: <Suspense fallback={<Loader/>}><LabReports/></Suspense> },
    { path: '/pharmacy', element: <Suspense fallback={<Loader/>}><Pharmacy/></Suspense> },
    { path: '/billing', element: <Suspense fallback={<Loader/>}><Billing/></Suspense> },
    { path: '/reports', element: <Suspense fallback={<Loader/>}><Reports/></Suspense> },
    { path: '/map', element: <Suspense fallback={<Loader/>}><ClinicMap/></Suspense> },
    { path: '/notifications', element: <Suspense fallback={<Loader/>}><Notifications/></Suspense> },
  ]},
  { path: '*', element: <Suspense fallback={<Loader/>}><NotFound/></Suspense> }
]);
