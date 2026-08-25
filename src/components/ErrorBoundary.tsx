import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface State { hasError:boolean; message?:string }

export default class ErrorBoundary extends Component<{children:ReactNode}, State> {
  state: State = { hasError:false };

  static getDerivedStateFromError(err:unknown):State{
    return { hasError:true, message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(err:Error, info:ErrorInfo){
    console.error('[HMS ErrorBoundary]', err.message, info.componentStack);
  }

  render(){
    if(!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-paper dark:bg-inkdark grid place-items-center p-6">
        <div className="card max-w-md text-center">
          <p className="ticket-tag">ERROR · CAUGHT BY BOUNDARY</p>
          <h1 className="font-display text-3xl font-semibold mt-3">Something went wrong</h1>
          <p className="text-slate text-sm mt-2">The screen hit an unexpected state. Your data is safe — reloading usually fixes it.</p>
          {this.state.message && <p className="font-mono text-[10px] text-slate/70 mt-2 break-words">{this.state.message}</p>}
          <div className="perf my-5 relative"><span className="perf-notch left"/><span className="perf-notch right"/></div>
          <div className="flex gap-2 justify-center">
            <button className="btn-primary" onClick={()=>window.location.reload()}>Reload</button>
            <a className="btn-outline" href="/dashboard">Go to Dashboard</a>
          </div>
        </div>
      </div>
    );
  }
}
