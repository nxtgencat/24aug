import { Link } from 'react-router-dom';

export default function NotFound(){
  return (
    <div className="min-h-screen bg-paper dark:bg-inkdark grid place-items-center p-6">
      <div className="card max-w-md text-center">
        <p className="ticket-tag">HTTP 404 · PAGE NOT FOUND</p>
        <h1 className="font-display text-5xl font-semibold mt-4">404</h1>
        <p className="text-slate text-sm mt-2">That page checked out without an appointment.</p>
        <div className="perf my-6 relative"><span className="perf-notch left"/><span className="perf-notch right"/></div>
        <div className="flex gap-2 justify-center">
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          <Link to="/login" className="btn-outline">Login</Link>
        </div>
      </div>
    </div>
  );
}
