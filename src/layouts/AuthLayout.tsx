import { Outlet } from 'react-router-dom';
export default function AuthLayout(){
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-paper dark:bg-inkdark">
      <div className="hidden md:grid place-items-center bg-ink dark:bg-paperdark text-paper dark:text-inkdark p-10">
        <div className="max-w-md">
          <span className="ticket-tag !text-white/60 !border-white/20">Tearline · Hospital HMS</span>
          <h1 className="font-display text-4xl font-semibold mt-6">Care, <span className="text-cobalt-light">organized.</span></h1>
          <p className="mt-4 text-white/70 leading-relaxed">Secure auth, role-based access, and enterprise workflows — built on Tearline primitives.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 p-4"><p className="font-mono text-xs">Demo Accounts</p><p className="text-xs mt-1 opacity-70">admin / doctor / receptionist / patient — any password</p></div>
            <div className="rounded-xl bg-cobalt p-4"><p className="font-mono text-xs">Phase 1 Visual</p><p className="text-xs mt-1">Auth + Dashboard ready for team review</p></div>
          </div>
        </div>
      </div>
      <div className="grid place-items-center p-6">
        <Outlet/>
      </div>
    </div>
  );
}
