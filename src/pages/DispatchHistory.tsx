import { motion } from 'framer-motion';
import { mockDispatchLogs } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { Clock, User, Building2, Wrench, AlertTriangle, CheckCircle, Send, ArrowUpCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  processing: { icon: Loader2, color: 'text-muted-foreground', label: 'PROCESSING' },
  dispatched: { icon: Send, color: 'text-warning', label: 'DISPATCHED' },
  resolved: { icon: CheckCircle, color: 'text-safe', label: 'RESOLVED' },
  escalated: { icon: ArrowUpCircle, color: 'text-critical', label: 'ESCALATED' },
};

export default function DispatchHistory() {
  const logs = [...mockDispatchLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-14">
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dispatch History</h1>
          <p className="font-mono text-xs text-muted-foreground mt-1">ALL VENDOR DISPATCHES · CHRONOLOGICAL LOG</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['processing', 'dispatched', 'resolved', 'escalated'] as const).map((s, i) => {
            const count = logs.filter(l => l.status === s).length;
            const cfg = statusConfig[s];
            return (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <cfg.icon className={`h-3.5 w-3.5 ${cfg.color} ${s === 'processing' ? 'animate-spin' : ''}`} />
                  <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{cfg.label}</span>
                </div>
                <p className={`font-mono text-xl font-bold ${cfg.color}`}>{count}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {logs.map((log, i) => {
            const cfg = statusConfig[log.status];
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="relative flex gap-4 rounded-lg border border-border bg-card p-4 hover:bg-secondary/20 transition-colors"
              >
                {/* Status indicator */}
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    log.status === 'resolved' ? 'border-safe/30 bg-safe/10' :
                    log.status === 'escalated' ? 'border-critical/30 bg-critical/10' :
                    log.status === 'dispatched' ? 'border-warning/30 bg-warning/10' :
                    'border-border bg-secondary/30'
                  }`}>
                    <StatusIcon className={`h-4 w-4 ${cfg.color} ${log.status === 'processing' ? 'animate-spin' : ''}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground leading-tight">{log.message}</p>
                    <StatusBadge status={log.alertType} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-[10px] text-muted-foreground">{log.propertyName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wrench className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-[10px] text-muted-foreground">{log.system}</span>
                    </div>
                    {log.vendorAssigned ? (
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-[10px] text-foreground">{log.vendorAssigned}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3 w-3 text-warning" />
                        <span className="font-mono text-[10px] text-warning">UNASSIGNED</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {format(new Date(log.timestamp), 'MMM d, yyyy · HH:mm:ss')}
                    </span>
                    <span className={`ml-auto font-mono text-[9px] tracking-wider ${cfg.color}`}>{cfg.label}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}