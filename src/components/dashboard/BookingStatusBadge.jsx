import { Badge } from '@/components/ui';
import { STATUS_LABEL, STATUS_STYLE } from '@/constants/bookingStatus';

export function BookingStatusBadge({ status }) {
  return (
    <Badge className={STATUS_STYLE[status] ?? 'bg-line text-ink/70'}>
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}