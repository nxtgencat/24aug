export default function EmptyState({title,desc}:{title:string;desc?:string}){
  return <div className="card text-center py-12"><p className="font-display text-lg">{title}</p>{desc&&<p className="text-slate text-sm mt-2">{desc}</p>}</div>;
}
