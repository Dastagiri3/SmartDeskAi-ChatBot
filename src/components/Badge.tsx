interface BadgeProps {
  variant: 'open' | 'resolved' | 'escalated' | 'high' | 'medium' | 'low' | 'en' | 'ja';
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ variant, children, className = '' }: BadgeProps) => {
  const variants = {
    open: 'bg-warning-100 text-warning-700 border-warning-200',
    resolved: 'bg-accent-100 text-accent-700 border-accent-200',
    escalated: 'bg-danger-100 text-danger-700 border-danger-200',
    high: 'bg-accent-100 text-accent-700 border-accent-200',
    medium: 'bg-warning-100 text-warning-700 border-warning-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
    en: 'bg-primary-100 text-primary-700 border-primary-200',
    ja: 'bg-primary-100 text-primary-700 border-primary-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
