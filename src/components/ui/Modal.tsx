export default function Modal({open,onClose,children,title}:{open:boolean;onClose:()=>void;children:React.ReactNode;title?:string}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-lg rounded-xl bg-surface dark:bg-surfacedark shadow-lg border border-line dark:border-linedark p-6 animate-[fadeUp_.3s_ease]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="btn-icon">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
