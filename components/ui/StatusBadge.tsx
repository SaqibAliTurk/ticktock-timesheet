import React from 'react';
import { TimesheetStatus } from '@/types';

interface StatusBadgeProps {
  status: TimesheetStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    COMPLETED: 'bg-green-100 text-green-800',
    INCOMPLETE: 'bg-yellow-100 text-yellow-800',
    MISSING: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};
