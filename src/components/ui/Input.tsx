import { cn } from '../../utils/helpers';
type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?:string; error?:string };
export default function Input({label, error, className, ...rest}:Props){
  return (<div>
    {label && <label className="mini-tag mb-1 block">{label}</label>}
    <input className={cn('field', className)} {...rest}/>
    {error && <p className="text-rose text-xs mt-1">{error}</p>}
  </div>);
}
