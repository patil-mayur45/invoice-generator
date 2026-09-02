const STYLES = {
  paid: "bg-emerald-50 text-secondary border-emerald-200",
  sent: "bg-amber-50 text-warning border-amber-200",
  pending: "bg-amber-50 text-warning border-amber-200",
  overdue: "bg-red-50 text-danger border-red-200",
  draft: "bg-slate-100 text-textSecondary border-slate-200",
  cancelled: "bg-slate-100 text-textSecondary border-slate-200",
};

const StatusBadge = ({ status }) => {
  const style = STYLES[status] || STYLES.draft;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${style}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
