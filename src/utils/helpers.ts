import dayjs from 'dayjs';
export const formatDate = (d: string) => dayjs(d).format('MMM D, YYYY');
export const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const paginate = <T,>(arr: T[], page: number, perPage: number) => arr.slice((page-1)*perPage, page*perPage);
export const cn = (...c: (string|false|undefined)[]) => c.filter(Boolean).join(' ');
