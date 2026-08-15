import { Badge } from '@/components/ui';

/**
 * Amber hanya dipakai untuk ini di seluruh aplikasi,
 * supaya begitu warnanya muncul maknanya tunggal: jadwal bertabrakan.
 */
export function DashboardConflictBadge() {
  return <Badge className="bg-amber/15 text-amber">Jadwal bentrok</Badge>;
}