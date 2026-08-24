import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { Role } from '../types';

const schema = yup.object({ email: yup.string().email().required(), password: yup.string().min(6).required(), role: yup.string().required() });

export default function Login(){
  const { login } = useAuth(); const nav=useNavigate();
  const { register, handleSubmit, formState:{errors} } = useForm({resolver: yupResolver(schema), defaultValues:{email:'admin@medicare.test', password:'123456', role:'admin'}});
  const onSubmit=(data:any)=>{
    login(data.email, data.role as Role);
    toast.success(`Welcome ${data.role}`);
    nav('/dashboard');
  };
  return (
    <div className="w-full max-w-md">
      <div className="card">
        <span className="ticket-tag">LOGIN</span>
        <h1 className="font-display text-2xl font-semibold mt-3">Sign in to MediCare</h1>
        <p className="text-sm text-slate mt-1">Tearline field + button primitives</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" {...register('email')} error={errors.email?.message as string}/>
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message as string}/>
          <div>
            <label className="mini-tag mb-1 block">Role</label>
            <select className="field" {...register('role')}>
              <option value="admin">Admin — Full Access</option><option value="doctor">Doctor</option><option value="receptionist">Receptionist</option><option value="patient">Patient</option>
            </select>
          </div>
          <Button className="w-full justify-center" type="submit">Sign In</Button>
          <div className="flex justify-between text-xs">
            <Link to="/register" className="text-cobalt hover:underline">Create account</Link>
            <Link to="/forgot" className="text-slate hover:underline">Forgot password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
