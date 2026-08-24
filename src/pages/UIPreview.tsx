import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import FileUpload from '../components/ui/FileUpload';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';

export default function UIPreview(){
  return (
    <div className="space-y-6">
      <div>
        <span className="ticket-tag">REUSABLE COMPONENTS · TEARLINE</span>
        <h1 className="font-display text-2xl font-semibold mt-2">UI Preview — For Team Demo</h1>
        <p className="text-slate text-sm">All primitives extracted from design/tearline/index.html — show this to validate design system compliance. Removed in Phase 3.</p>
      </div>
      <div className="card space-y-3">
        <p className="mini-tag">BUTTONS</p>
        <div className="flex flex-wrap gap-2"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><button className="btn-icon">★</button></div>
      </div>
      <div className="card">
        <p className="mini-tag">FIELDS</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-2"><Input label="Text field" placeholder="Placeholder"/><Input label="With error" error="Invalid value" placeholder="Error state"/></div>
      </div>
      <div className="card">
        <p className="mini-tag">BADGES & TABLE</p>
        <div className="flex gap-2 mt-2"><Badge>Default</Badge><Badge variant="success">Success</Badge><Badge variant="warning">Warning</Badge><Badge variant="danger">Danger</Badge></div>
        <div className="mt-4 overflow-auto rounded-xl border border-line dark:border-linedark"><table className="w-full text-sm"><thead><tr className="bg-paper dark:bg-inkdark"><th className="px-4 py-2 text-left mini-tag">Name</th><th className="px-4 py-2 text-left mini-tag">Status</th></tr></thead><tbody><tr className="border-t"><td className="px-4 py-2">Example row</td><td className="px-4 py-2"><Badge variant="success">Active</Badge></td></tr></tbody></table></div>
      </div>
      <FileUpload label="File Upload (Preview + Progress + Validation)"/>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card"><p className="mini-tag mb-2">LOADER</p><Loader/></div>
        <div className="card"><EmptyState title="No data" desc="Empty state primitive with card pattern"/></div>
      </div>
      <div className="card"><p className="mini-tag">SKELETON</p><div className="mt-2 space-y-2"><div className="h-4 skeleton rounded animate-shimmer"/><div className="h-4 skeleton rounded animate-shimmer w-3/4"/></div></div>
    </div>
  );
}
