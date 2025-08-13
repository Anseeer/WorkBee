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
