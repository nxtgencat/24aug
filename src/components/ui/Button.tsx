import { cn } from '../../utils/helpers';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary'|'outline'|'ghost' };
export default function Button({variant='primary', className, children, ...rest}: Props){
  const base = variant==='primary' ? 'btn-primary' : variant==='secondary' ? 'btn-secondary' : variant==='outline' ? 'btn-outline' : 'btn-ghost';
  return <button className={cn(base, className)} {...rest}>{children}</button>;
}
