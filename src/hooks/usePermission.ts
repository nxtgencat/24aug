import { useAuth } from './useAuth';
import { PERMISSIONS } from '../constants';
export function usePermission(){
  const { user } = useAuth();
  const can = (perm: string) => {
    if(!user) return false;
    const perms = PERMISSIONS[user.role] || [];
    return perms.includes('*') || perms.includes(perm);
  };
  return { can, role: user?.role };
}
