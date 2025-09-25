export const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    Pending: 'bg-orange-100 text-orange-800',
    Canceled: 'bg-red-100 text-red-800',
    Accepted: 'bg-blue-100 text-blue-800',
    Rejected: 'bg-red-100 text-red-800',
    Completed: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status ?? 'Pending'] || ''}`}>
      {status || 'Pending'}
    </span>
  );
};

export const NotificationBadge: React.FC<{ type?: string }> = ({ type }) => {
  const colors: Record<string, string> = {
    job_request: 'bg-blue-100 text-blue-800',
    job_accepted: 'bg-yellow-100 text-yellow-800',
    job_paid: 'bg-green-100 text-green-800',
    job_cancelled: 'bg-red-100 text-red-800',
    job_completed: 'bg-purple-100 text-purple-800',
  };

  const normalized = type?.toLowerCase() ?? '';

  const label = normalized
    ? normalized.replace('job_', '').replace('_', ' ').toUpperCase()
    : 'UNKNOWN';

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[normalized] || 'bg-gray-100 text-gray-800'
        }`}
    >
      {label}
    </span>
  );
};
