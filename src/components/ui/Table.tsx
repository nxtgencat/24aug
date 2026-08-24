export default function Table({headers, rows}:{headers:string[]; rows:React.ReactNode[][]}){
  return (
    <div className="overflow-auto rounded-xl border border-line dark:border-linedark">
      <table className="w-full text-sm">
        <thead className="bg-paper dark:bg-inkdark">
          <tr>{headers.map(h=><th key={h} className="text-left px-4 py-3 mini-tag">{h}</th>)}</tr>
        </thead>
        <tbody>{rows.map((r,i)=><tr key={i} className="border-t border-line dark:border-linedark hover:bg-paper/50 dark:hover:bg-white/[.02]"><td className="px-0 py-0" colSpan={headers.length}><div className="grid" style={{gridTemplateColumns:`repeat(${headers.length},1fr)`}}>{r.map((c,j)=><div key={j} className="px-4 py-3 truncate">{c}</div>)}</div></td></tr>)}</tbody>
      </table>
    </div>
  );
}
