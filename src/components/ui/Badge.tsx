export default function Badge({children,variant='default'}:{children:React.ReactNode; variant?: 'default'|'success'|'warning'|'danger'}){
  const map:Record<string,string>={ default:'bg-paper dark:bg-inkdark border border-line dark:border-linedark', success:'bg-mint text-white', warning:'bg-amber text-ink', danger:'bg-rose text-white' };
  return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${map[variant]}`}>{children}</span>;
}
