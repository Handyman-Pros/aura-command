import { motion } from 'framer-motion';
import { SystemStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: SystemStatus | string;
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; pulseClass: string }> = {
  safe: { bg: 'bg-safe/10 border-safe/20', text: 'text-safe', dot: 'bg-safe', pulseClass: 'pulse-safe' },
  compliant: { bg: 'bg-safe/10 border-safe/20', text: 'text-safe', dot: 'bg-safe', pulseClass: 'pulse-safe' },
  warning: { bg: 'bg-warning/10 border-warning/20', text: 'text-warning', dot: 'bg-warning', pulseClass: 'pulse-warning' },
  pending: { bg: 'bg-warning/10 border-warning/20', text: 'text-warning', dot: 'bg-warning', pulseClass: 'pulse-warning' },
  dispatching: { bg: 'bg-warning/10 border-warning/20', text: 'text-warning', dot: 'bg-warning', pulseClass: 'pulse-warning' },
  critical: { bg: 'bg-critical/10 border-critical/20', text: 'text-critical', dot: 'bg-critical', pulseClass: 'pulse-critical' },
  expired: { bg: 'bg-critical/10 border-critical/20', text: 'text-critical', dot: 'bg-critical', pulseClass: 'pulse-critical' },
  'non-compliant': { bg: 'bg-critical/10 border-critical/20', text: 'text-critical', dot: 'bg-critical', pulseClass: 'pulse-critical' },
  processing: { bg: 'bg-warning/10 border-warning/20', text: 'text-warning', dot: 'bg-warning', pulseClass: 'pulse-warning' },
  dispatched: { bg: 'bg-primary/10 border-primary/20', text: 'text-primary', dot: 'bg-primary', pulseClass: 'pulse-safe' },
  resolved: { bg: 'bg-safe/10 border-safe/20', text: 'text-safe', dot: 'bg-safe', pulseClass: '' },
  escalated: { bg: 'bg-critical/10 border-critical/20', text: 'text-critical', dot: 'bg-critical', pulseClass: 'pulse-critical' },
};

export default function StatusBadge({ status, label, pulse = false, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.safe;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      } font-mono font-medium ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} ${pulse ? config.pulseClass : ''}`} />
      {displayLabel}
    </motion.span>
  );
}
