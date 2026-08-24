import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
export default function Register(){
  const nav=useNavigate();
  return (
    <div className="w-full max-w-md card">
      <span className="ticket-tag">REGISTER</span>
      <h1 className="font-display text-2xl font-semibold mt-3">Create account</h1>
      <div className="mt-6 space-y-3">
        <Input label="Full Name" placeholder="Aarav Mehta"/>
        <Input label="Email" placeholder="you@medicare.test"/>
        <Input label="Password" type="password" placeholder="Min 6 characters"/>
        <Button className="w-full" onClick={()=>nav('/login')}>Create & Sign In</Button>
        <p className="text-xs text-center"><Link to="/login" className="text-cobalt">Back to login</Link></p>
      </div>
    </div>
  );
}
