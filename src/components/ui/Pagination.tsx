export default function Pagination({page,totalPages,onChange}:{page:number; totalPages:number; onChange:(p:number)=>void}){
  return (
    <div className="flex items-center gap-2 justify-end mt-4">
      <button className="btn-outline py-1.5" disabled={page<=1} onClick={()=>onChange(page-1)}>Prev</button>
      <span className="font-mono text-xs px-3 py-1 rounded bg-paper dark:bg-inkdark border border-line dark:border-linedark">{page} / {totalPages}</span>
      <button className="btn-outline py-1.5" disabled={page>=totalPages} onClick={()=>onChange(page+1)}>Next</button>
    </div>
  );
}
